# CRM Hub — Documentation des modifications Backend

---

## 1. Architecture globale du Backend

```
CRM.sln
├── CRM.WebAPI          ← API ASP.NET Core 8.0 (contrôleurs, DTOs, middlewares, JWT)
├── CRM.Services        ← Couche métier (services + interfaces)
├── CRM.DAL             ← Couche d'accès aux données (EF Core + Dapper)
├── CRM.Core            ← Noyau partagé (exceptions personnalisées)
├── CRM.Entities        ← Modèles / Entités (Security + CRM)
├── CRM.Database        ← Projet SQL Server (tables, schémas, stored procedures)
└── CRM.Worker          ← Worker Service (service d'arrière-plan, template par défaut)
```

**Framework cible** : .NET 8.0 sur tous les projets.

---

## 2. CRM.WebAPI — Projet API

### 2.1 Program.cs — Configuration principale

| Élément | Description |
| ------- | ----------- |
| **DbContext Security** | `SecurityDbContext` — Identity (schéma `sec`) connecté via `ConnectionStrings:CRM` |
| **DbContext Data** | `DataContext` — Données métier CRM (schéma `crm`) connecté via `ConnectionStrings:CRM` |
| **Identity** | `AddIdentity<SecUser, SecRole>()` avec EF stores + token providers |
| **Repositories** | `IUserRepository`, `IGenericRepository<T>`, `IProspectRepositoryDapper` injectés en Scoped |
| **Services** | `IAdminSeeder`, `IUserService`, `IProspectService` injectés en Scoped |
| **JWT** | Schéma "Bearer" avec validation Issuer/Audience/SigningKey (clé dans `appsettings.json`) |
| **Swagger** | Activé en dev, accessible à la racine `/` |
| **Middleware** | `ExceptionMiddleware` — gestion globale des erreurs |
| **Pipeline** | `UseMiddleware → UseHttpsRedirection → UseAuthentication → UseAuthorization → MapControllers` |

### 2.2 Controllers

#### AuthController (`Controllers/AuthController.cs`)

| Route | Méthode | Description |
| ----- | ------- | ----------- |
| `POST /users` | `CreateUser` | Crée un utilisateur (email, userName, nom, prénom, password, rôle) |
| `POST /login` | `Login` | Authentifie un utilisateur et retourne un JWT token |

**Détails de `/login`** :
1. Recherche l'utilisateur par email via `UserManager.FindByEmailAsync()`
2. Vérifie le mot de passe via `UserManager.CheckPasswordAsync()`
3. Récupère les rôles via `UserManager.GetRolesAsync()`
4. Génère un JWT avec les claims : `Sub`, `Email`, `UniqueName`, `IsActive`, `Role`
5. Token valide 24 heures, signé avec HMAC-SHA256
6. Retourne : `{ token, expiration, user: { id, email, userName, nom, prenom, roles } }`

**Modifications apportées** :
- Ajout de `[ApiController]` sur la classe — active le binding automatique du JSON
- Ajout de `[FromBody]` sur les paramètres — force ASP.NET à lire le body JSON
- Sans ces attributs, les propriétés (`email`, `password`) arrivaient `null`

#### ProspectController (`Controllers/ProspectController.cs`)

| Route | Méthode | Description |
| ----- | ------- | ----------- |
| `GET /api/Prospect` | `GetAll` | Récupère tous les prospects (EF Core) |
| `GET /api/Prospect/getAllDapper` | `GetAllDapper` | Récupère tous les prospects (Dapper / stored procedure) |
| `GET /api/Prospect/{id}` | `GetById` | Récupère un prospect par son ID |
| `POST /api/Prospect` | `Create` | Crée un nouveau prospect |
| `PUT /api/Prospect` | `Update` | Met à jour un prospect existant |
| `DELETE /api/Prospect/{id}` | `Delete` | Supprime un prospect par son ID |

#### WeatherForecastController (`Controllers/WeatherForecastController.cs`)

- Template par défaut ASP.NET — `GET /WeatherForecast`
- Retourne 5 prévisions météo aléatoires (utilisé pour tester que l'API fonctionne)

### 2.3 DTOs

| Fichier | Propriétés |
| ------- | ---------- |
| `LoginDto.cs` | `Email` (required), `Password` (required) |
| `CreateUserDto.cs` | `Email` (required), `UserName` (required), `Password` (required), `Nom`, `Prenom`, `Role` |

### 2.4 Middlewares

#### ExceptionMiddleware (`Middlewares/ExceptionMiddleware.cs`)

Intercepte toutes les exceptions non gérées dans le pipeline HTTP.

| Type d'exception | Comportement |
| ---------------- | ------------ |
| `BusinessException` | Retourne le `StatusCode` personnalisé + message JSON `{ error: "..." }` |
| `Exception` (générique) | Log l'erreur + retourne `500` avec `{ message: "Une erreur interne est survenue" }` |

### 2.5 Configuration (`appsettings.json`)

```json
{
  "Jwt": {
    "Key": "9F4A2B8C1D7E6F5G...",
    "Issuer": "CRM.API",
    "Audience": "CRM.Client",
    "ExpiresHours": 4
  },
  "AdminSeed": {
    "Email": "admin@crm.local",
    "Password": "Admin@123",
    "UserName": "admin"
  },
  "ConnectionStrings": {
    "CRM": "Server=LAPTOP-QR48KQME;Database=CRM;Integrated Security=True;TrustServerCertificate=True;"
  }
}
```

---

## 3. CRM.Services — Couche métier

### 3.1 UserService

| Méthode | Description |
| ------- | ----------- |
| `CreateUserAsync(user, password, role)` | Hash le mot de passe, ajoute l'utilisateur, assigne le rôle, sauvegarde |
| `GetRoleByRoleName(roleName)` | Récupère un rôle par son nom |
| `GetRolesByRoleIdAsync(roleId)` | Récupère les UserRoles par ID de rôle |

### 3.2 ProspectService

| Méthode | Description |
| ------- | ----------- |
| `GetAllAsync()` | Récupère tous les prospects via EF Core (`GenericRepository`) |
| `GetAllAsyncDapper()` | Récupère tous les prospects via Dapper (stored procedure `crm.GetAllProspect`) |
| `GetByIdAsync(id)` | Récupère un prospect par ID — lance `BusinessException(404)` si introuvable |
| `CreateAsync(prospect)` | Crée un prospect, définit `DateCreation` si null |
| `UpdateAsync(prospect)` | Met à jour un prospect existant |
| `DeleteAsync(id)` | Supprime un prospect par ID |

### 3.3 AdminSeeder / AdminSeederHostedService

- **AdminSeeder** : crée le premier compte admin au démarrage (si aucun admin n'existe)
- **AdminSeederHostedService** : `IHostedService` qui appelle `AdminSeeder.SeedAsync()` au démarrage
- Actuellement **commenté** dans `Program.cs` (`//builder.Services.AddHostedService<AdminSeederHostedService>()`)

---

## 4. CRM.DAL — Couche d'accès aux données

### 4.1 Deux approches d'accès aux données

| Approche | Technologie | Utilisation |
| -------- | ----------- | ----------- |
| **EF Core** | `GenericRepository<T>` + `DataContext` | CRUD standard (Prospects, etc.) |
| **Dapper** | `RepositoryBaseDapper` + Stored Procedures | Requêtes optimisées (lectures complexes) |

### 4.2 SecurityDbContext

```
Schéma : sec
Tables : Users, Roles, UserRoles, UserClaims, RoleClaims, UserLogins, UserTokens
```

- Hérite de `IdentityDbContext<SecUser, SecRole, Guid, ...>`
- Toutes les tables Identity sont mappées dans le schéma `sec`

### 4.3 DataContext

```
Schéma : crm
Tables : Prospect
```

- DbContext simple avec `DbSet<Prospect>`

### 4.4 GenericRepository\<T>

Repository générique EF Core avec méthodes CRUD :

| Méthode | Description |
| ------- | ----------- |
| `GetAllAsync()` | `_table.ToListAsync()` |
| `GetByIdAsync(id)` | `_table.FindAsync(id)` |
| `InsertAsync(entity)` | `_table.AddAsync(entity)` |
| `UpdateAsync(entity)` | `Attach + State = Modified` |
| `DeleteAsync(id)` | `FindAsync → Remove` |

### 4.5 RepositoryBaseDapper

Classe abstraite pour les repositories Dapper :

| Méthode | Description |
| ------- | ----------- |
| `ExecuteAsync<T>(sql, param)` | Exécute une stored procedure, retourne `IEnumerable<T>` |
| `ExecuteScalarAsync<T>(sql, param)` | Retourne un seul résultat |
| `ExecuteAsyncWithSplitOn(...)` | Mapping multi-tables (2 ou 3 types) |
| `ExecuteListAsyncWithSplitOn(...)` | Mapping multi-tables, retourne une `List` |
| `QueryWithMappingAsync(...)` | Mapping avec 4 types |

### 4.6 UserRepository

| Méthode | Description |
| ------- | ----------- |
| `AddAsync(user)` | Ajoute un `SecUser` au contexte |
| `AddUserRoleAsync(userRole)` | Ajoute un `UserRole` au contexte |
| `GetByEmailAsync(email)` | Recherche par email normalisé |
| `GetRoleByNameAsync(roleName)` | Recherche un rôle par nom normalisé |
| `GetRolesByRoleIdAsync(roleId)` | Retourne les `UserRoles` par `RoleId` |
| `SaveAsync()` | `SaveChangesAsync()` |

### 4.7 ProspectRepositoryDapper

- Hérite de `RepositoryBaseDapper`
- `GetAllProspect()` → exécute la stored procedure `crm.GetAllProspect`

### 4.8 SqlConstants

```csharp
Schema.comm = "comm"
Schema.crm  = "crm"
Schema.sec  = "sec"
SP.GetAllProspect = "crm.GetAllProspect"
```

### 4.9 UnitOfWork

- Pattern UnitOfWork implémenté mais **pas encore utilisé** dans les services
- `UnitOfWork<T>` wrape un `GenericRepository<T>` avec `Save()` synchrone

---

## 5. CRM.Core — Noyau partagé

### BusinessException (`Exceptions/BusinessException.cs`)

```csharp
public class BusinessException : Exception
{
    public int StatusCode { get; }
    public BusinessException(string message, int statusCode = 400)
}
```

- Exception métier avec code HTTP personnalisé
- Interceptée par `ExceptionMiddleware` pour retourner une réponse JSON propre

---

## 6. CRM.Entities — Modèles de données

### 6.1 Entités Security (schéma `sec`)

| Classe | Hérite de | Propriétés ajoutées |
| ------ | --------- | ------------------- |
| `SecUser` | `IdentityUser<Guid>` | `IsActive`, `Nom`, `Prenom` |
| `SecRole` | `IdentityRole<Guid>` | — |
| `UserRole` | `IdentityUserRole<Guid>` | — |
| `User` | — | `Id`, `UserName`, `Email`, `Nom`, `Prenom`, `PasswordHash`, `IsActive` (entité de base) |
| `Role` | — | (vide, placeholder) |

### 6.2 Entités CRM (schéma `crm`)

| Classe | Table | Propriétés |
| ------ | ----- | ---------- |
| `Prospect` | `crm.Prospect` | `Id`, `Nom`, `Prenom`, `Email`, `Telephone`, `Source`, `DateCreation`, `Notes` |
| `Comercial` | — | Hérite de `User`, ajoute `Nom`, `Prenom` |

---

## 7. CRM.Worker — Service d'arrière-plan

- Template Worker Service par défaut
- Log un message toutes les secondes
- **Aucune logique CRM implémentée pour l'instant**

---

## 8. Packages NuGet utilisés

| Projet | Package | Version |
| ------ | ------- | ------- |
| CRM.WebAPI | `Microsoft.AspNetCore.Authentication.JwtBearer` | 8.0.0 |
| CRM.WebAPI | `Microsoft.AspNetCore.Identity.EntityFrameworkCore` | 8.0.0 |
| CRM.WebAPI | `Microsoft.EntityFrameworkCore.SqlServer` | 8.0.0 |
| CRM.WebAPI | `Swashbuckle.AspNetCore` | 10.1.0 |
| CRM.Services | `Microsoft.Extensions.Hosting` | 8.0.1 |
| CRM.DAL | `Dapper` | 2.1.66 |
| CRM.DAL | `Microsoft.Data.SqlClient` | 5.1.1 |
| CRM.Entities | `Microsoft.AspNetCore.Identity.EntityFrameworkCore` | 8.0.0 |
| CRM.Worker | `Microsoft.Extensions.Hosting` | 8.0.1 |

---

## 9. Références entre projets

```
CRM.WebAPI  →  CRM.Services, CRM.DAL, CRM.Entities
CRM.Services  →  CRM.Core, CRM.DAL
CRM.DAL  →  CRM.Entities
```

---

## 10. Schémas de base de données

| Schéma | Tables |
| ------ | ------ |
| `sec` | Users, Roles, UserRoles, UserClaims, RoleClaims, UserLogins, UserTokens |
| `crm` | Prospect |
| `comm` | (défini, pas encore utilisé) |

---

## 11. Points d'attention / Bugs connus

| Problème | Fichier | Description |
| -------- | ------- | ----------- |
| **Appel récursif infini** | `UserService.cs` | `GetRolesByRoleIdAsync()` s'appelle lui-même au lieu de `_userRepository.GetRolesByRoleIdAsync()` → `StackOverflowException` |
| **Typo namespace** | `IProspectRepositoryDapper.cs` | Namespace `CRM.DAL.RepositoriesDupper` au lieu de `CRM.DAL.RepositoriesDapper` |
| **Nullable warnings** | `AuthController.cs` | `user.Email` et `user.UserName` peuvent être `null` dans les claims JWT (lignes 71-72) |
| **AdminSeeder désactivé** | `Program.cs` | `AddHostedService<AdminSeederHostedService>()` est commenté |
| **UnitOfWork inutilisé** | `UnitOfWork/` | Pattern implémenté mais jamais injecté ni utilisé |

---

## 12. Résumé des modifications clés

1. **Ajout de `[ApiController]` et `[FromBody]`** sur `AuthController` pour corriger le binding JSON
2. **Création du `ProspectController`** avec CRUD complet (EF Core + Dapper)
3. **Mise en place de JWT Bearer** pour l'authentification (claims avec rôles)
4. **Création de `ExceptionMiddleware`** pour la gestion globale des erreurs
5. **Double accès aux données** : `GenericRepository<T>` (EF Core) + `RepositoryBaseDapper` (Dapper)
6. **Séparation des DbContexts** : `SecurityDbContext` (Identity) + `DataContext` (données métier)
7. **Création de `BusinessException`** pour les erreurs métier avec code HTTP personnalisé
8. **Swagger** configuré à la racine en mode développement
9. **AdminSeeder** préparé pour créer le premier compte admin (actuellement désactivé)
