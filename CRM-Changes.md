# CRM Hub — Résumé des modifications

## 1. Structure du projet Angular (CRM.WEB)

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts          ← Garde de route (protège le dashboard)
│   ├── interceptors/
│   │   └── auth.interceptor.ts    ← Intercepteur HTTP (ajoute le token JWT)
│   ├── models/
│   │   └── auth.model.ts          ← Interfaces TypeScript (LoginRequest, LoginResponse, AuthUser)
│   └── services/
│       └── auth.service.ts        ← Service d'authentification (login, logout, gestion du token)
├── layout/
│   ├── navbar/                    ← Barre de navigation supérieure
│   ├── sidebar/                   ← Menu latéral gauche (violet foncé)
│   └── layout/                    ← Composant conteneur (sidebar + navbar + router-outlet)
├── pages/
│   ├── dashboard/                 ← Page tableau de bord
│   └── login/                     ← Page de connexion
├── app.config.ts                  ← Configuration (HttpClient, intercepteurs, routage)
├── app.routes.ts                  ← Définition des routes
├── app.html / app.css             ← Composant racine
└── environments/
    ├── environment.ts             ← Config dev (apiUrl: '/api')
    └── environment.prod.ts        ← Config prod
```

---

## 2. Page de Login

### Fichiers : `src/app/pages/login/`

| Fichier | Rôle |
|---------|------|
| `login.ts` | Composant Angular — gère le formulaire, appelle `AuthService.login()` |
| `login.html` | Template — panneau gauche (branding) + panneau droit (formulaire) |
| `login.css` | Styles — design split-screen violet/blanc |

### Fonctionnalités :
- **Panneau gauche** : branding CRM Hub avec 4 points forts (prospects, équipe, catalogue, sécurité)
- **Panneau droit** : formulaire de connexion avec :
  - Sélecteur de rôle (Admin / Commercial)
  - Champ email avec icône
  - Champ mot de passe avec toggle visibilité (œil)
  - Bouton "Se Connecter" avec spinner de chargement
  - Message d'erreur contextuel (401 = mauvais identifiants, 0 = serveur inaccessible)
  - Lien "S'inscrire"

---

## 3. Service d'authentification

### Fichier : `src/app/core/services/auth.service.ts`

```typescript
// Ce que fait le service :
login(email, password) → POST /api/login → reçoit { token, user }
                       → stocke dans localStorage
                       → met à jour les signaux (currentUser, token)

logout()             → supprime localStorage
                     → redirige vers /login
```

### Signaux réactifs exposés :
| Signal | Description |
|--------|-------------|
| `isAuthenticated` | `true` si un token existe |
| `userFullName` | `"Prenom Nom"` de l'utilisateur connecté |
| `userRoles` | Liste des rôles (`["ADMIN"]`, `["COMMERCIAL"]`) |
| `user` | Objet complet `AuthUser` |

### Stockage localStorage :
| Clé | Valeur |
|-----|--------|
| `crm_token` | Le JWT token |
| `crm_user` | L'objet utilisateur (JSON) |

---

## 4. Intercepteur HTTP

### Fichier : `src/app/core/interceptors/auth.interceptor.ts`

- Intercepte **chaque requête HTTP** sortante
- Si un token existe dans `AuthService`, ajoute le header :
  ```
  Authorization: Bearer <token>
  ```
- Sinon, laisse passer la requête sans modification

---

## 5. Garde de route (Auth Guard)

### Fichier : `src/app/core/guards/auth.guard.ts`

- Vérifie `AuthService.isAuthenticated()` avant d'accéder aux routes protégées
- Si **authentifié** → accès autorisé
- Si **non authentifié** → redirection vers `/login`

---

## 6. Routage

### Fichier : `src/app/app.routes.ts`

```
/login          → Page de connexion (publique, pas de layout)
/               → Redirige vers /dashboard
/dashboard      → Tableau de bord (protégé par authGuard, avec layout sidebar+navbar)
```

Le layout (sidebar + navbar) n'apparaît **que** sur les routes protégées.
La page login est en **plein écran** sans sidebar ni navbar.

---

## 7. Layout — Sidebar

### Fichier : `src/app/layout/sidebar/`

Menu latéral violet foncé (`#1e1b3a`) avec :
- Logo CRM Hub
- 6 liens de navigation avec icônes Material :
  - Dashboard, Prospects, Employees, Products, Reports, Settings
- Lien actif surligné en violet (`#7c5cfc`)
- Position fixe, largeur 220px

---

## 8. Layout — Navbar

### Fichier : `src/app/layout/navbar/`

Barre supérieure blanche avec :
- Logo CRM Hub (à gauche)
- Barre de recherche (au centre)
- Icônes notifications + settings (à droite)
- Bouton déconnexion (icône logout)
- Nom de l'utilisateur connecté (depuis `AuthService.userFullName()`)

---

## 9. Dashboard

### Fichier : `src/app/pages/dashboard/`

Sections du tableau de bord :
1. **Welcome** — "Welcome, Prenom Nom!"
2. **Overview Metrics** — 4 cartes (Prospects, Employés, Produits, Conversions)
3. **Recent Prospects** — Tableau avec statuts (New, Contacted, Qualified, Nurturing, Lost)
4. **Team Quick Contacts** — 4 cartes membres d'équipe
5. **Product Catalog Preview** — 4 cartes produits avec catégories
6. **Recent Actions Feed** — Timeline d'activités récentes
7. **FAB** — Bouton flottant "Add New Prospect"

---

## 10. Proxy (développement)

### Fichier : `proxy.conf.json`

```json
{
  "/api": {
    "target": "https://localhost:7210",
    "secure": false,
    "pathRewrite": { "^/api": "" }
  }
}
```

**Explication** : En développement, Angular tourne sur `localhost:4200`.
Le backend API tourne sur `https://localhost:7210`.
Le proxy redirige toute requête `/api/xxx` vers `https://localhost:7210/xxx`.

Exemple : `POST /api/login` → `POST https://localhost:7210/login`

---

## 11. Modifications Backend (AuthController)

### Fichier : `CRM.WebAPI/Controllers/AuthController.cs`

**Ajouts** :
- `[ApiController]` — Active le binding automatique du JSON
- `[FromBody]` sur les paramètres `LoginDto` et `CreateUserDto` — Oblige ASP.NET à lire le body JSON

**Avant** (ne fonctionnait pas, `email` arrivait `null`) :
```csharp
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
```

**Après** (fonctionne correctement) :
```csharp
[ApiController]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
```

### Réponse du backend sur `POST /login` :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiration": "2026-02-17T21:00:00Z",
  "user": {
    "id": "guid",
    "email": "admin@crm.local",
    "userName": "admin",
    "nom": "...",
    "prenom": "...",
    "roles": ["ADMIN"]
  }
}
```

---

## 12. Flux complet de connexion

```
1. Utilisateur ouvre http://localhost:4200
2. authGuard vérifie → pas de token → redirige vers /login
3. Utilisateur saisit email + mot de passe → clique "Se Connecter"
4. Angular POST /api/login { email, password }
5. Proxy redirige vers https://localhost:7210/login
6. Backend vérifie les identifiants → retourne { token, user }
7. AuthService stocke le token + user dans localStorage
8. Router navigue vers /dashboard
9. authGuard vérifie → token existe → accès autorisé
10. Layout s'affiche (sidebar + navbar + dashboard)
11. Navbar affiche "Prenom Nom" depuis AuthService
12. Toutes les requêtes HTTP suivantes incluent le header Authorization: Bearer <token>
```

---

## 13. Commandes utiles

```bash
# Lancer le frontend Angular
cd CRM.WEB
ng serve --open

# Lancer le backend API
cd CRM.WebAPI
dotnet run

# Compte de test
Email:    admin@crm.local
Password: Admin@123
```
