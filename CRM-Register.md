# CRM Hub - Page d'Inscription (Register)

Documentation de la page d'inscription ajoutée au projet **CRM.WEB**.

---

## Résumé

La page d'inscription permet de créer un nouveau compte utilisateur (Admin ou Commercial) en communiquant avec l'endpoint backend `POST /users`.  
Après une inscription réussie, l'utilisateur est automatiquement redirigé vers la page de connexion.

---

## Fichiers Créés / Modifiés

### Fichiers créés

| Fichier | Rôle |
|---------|------|
| `src/app/pages/register/register.ts` | Composant Angular (logique) |
| `src/app/pages/register/register.html` | Template HTML |
| `src/app/pages/register/register.css` | Styles CSS |

### Fichiers modifiés

| Fichier | Modification |
|---------|-------------|
| `src/app/app.routes.ts` | Ajout de la route `/register` (lazy-loaded) |
| `src/app/core/models/auth.model.ts` | Ajout de l'interface `RegisterRequest` |
| `src/app/core/services/auth.service.ts` | Ajout de la méthode `register()` |

---

## Architecture de la Page

### Design Split-Screen

La page utilise un design en deux panneaux, similaire à la page login :

```
┌──────────────────────────────────────────────────┐
│  Left Panel (420px)  │     Right Panel (flex)     │
│  ┌────────────────┐  │  ┌──────────────────────┐  │
│  │  🔵 CRM Hub    │  │  │  Créer un Compte ✨   │  │
│  │                │  │  │                      │  │
│  │  Tagline       │  │  │  [Admin] [Commercial]│  │
│  │                │  │  │                      │  │
│  │  10K+ 98% 4.9★│  │  │  userName             │  │
│  │                │  │  │  [Nom]     [Prénom]   │  │
│  │ ┌────────────┐│  │  │  Email                │  │
│  │ │ Testimonial ││  │  │  Password  [████░░]  │  │
│  │ │ Sarah Lee   ││  │  │                      │  │
│  │ └────────────┘│  │  │  [Créer un Compte]    │  │
│  └────────────────┘  │  │                      │  │
│  Gradient violet     │  │  Déjà un compte ?    │  │
│                      │  └──────────────────────┘  │
└──────────────────────────────────────────────────┘
```

---

## Détail des Fichiers

### 1. `register.ts` — Composant Principal

**Type :** Standalone component  
**Imports :** `FormsModule`, `RouterLink`

#### Signals (état réactif)

| Signal | Type | Description |
|--------|------|-------------|
| `userName` | `string` | Nom d'utilisateur saisi |
| `nom` | `string` | Nom de famille |
| `prenom` | `string` | Prénom |
| `email` | `string` | Adresse email |
| `password` | `string` | Mot de passe |
| `selectedRole` | `'ADMIN' \| 'COMMERCIAL'` | Rôle sélectionné (défaut : ADMIN) |
| `showPassword` | `boolean` | Afficher/masquer le mot de passe |
| `isLoading` | `boolean` | État de chargement pendant l'appel API |
| `errorMessage` | `string` | Message d'erreur affiché |
| `successMessage` | `string` | Message de succès affiché |

#### Méthodes

| Méthode | Description |
|---------|-------------|
| `selectRole(role)` | Change le rôle sélectionné |
| `togglePassword()` | Bascule la visibilité du mot de passe |
| `getPasswordStrength()` | Calcule la force du mot de passe (0-4) |
| `onSubmit()` | Valide le formulaire et appelle l'API |

#### Calcul de la force du mot de passe

La méthode `getPasswordStrength()` retourne un score de 0 à 4 basé sur :

| Critère | Points |
|---------|--------|
| Longueur ≥ 6 caractères | +1 |
| Contient une majuscule | +1 |
| Contient un chiffre | +1 |
| Contient un caractère spécial | +1 |

#### Gestion des erreurs

| Code HTTP | Message affiché |
|-----------|-----------------|
| `400` | Messages de validation du backend (ou "Données invalides.") |
| `0` | "Impossible de contacter le serveur." |
| Autre | "Une erreur est survenue. Veuillez réessayer." |

#### Flux de soumission

```
onSubmit()
  ├── Vérification champs vides → Erreur locale
  └── authService.register({...})
        ├── Succès → "Compte créé avec succès !" → Redirection /login (1.5s)
        └── Erreur → Affichage du message d'erreur approprié
```

---

### 2. `register.html` — Template

#### Panneau Gauche (gradient violet)

- **Logo** : Icône `hub` + "CRM Hub"
- **Tagline** : "Rejoignez des milliers d'équipes..."
- **Statistiques** :
  - `10K+` Utilisateurs
  - `98%` Disponibilité
  - `4.9★` Note
- **Témoignage** : Carte avec citation de Sarah Lee (Directrice Commerciale)

#### Panneau Droit (formulaire)

- **Titre** : "Créer un Compte ✨"
- **Sous-titre** : "Commencez gratuitement avec CRM Hub"
- **Séparateur** : "Créer un compte avec email"
- **Sélecteur de rôle** : Deux boutons toggle (Admin / Commercial)
- **Champs du formulaire** :
  - Nom d'utilisateur (icône `person_outline`)
  - Nom + Prénom (côte à côte, icône `person`)
  - Email (icône `mail_outline`)
  - Mot de passe (icône `lock_outline`, bouton voir/masquer)
- **Barre de force** : 4 segments colorés (rouge → orange → vert)
- **Bouton** : "Créer un Compte" avec spinner de chargement
- **Lien** : "Vous avez déjà un compte ? Se Connecter" → `/login`

#### Syntaxe Angular utilisée

- `@if` / `@for` : Nouveau control flow Angular 17+
- `[ngModel]` + `(ngModelChange)` : Binding bidirectionnel via signals
- `[class.active]` : Classes CSS conditionnelles
- `routerLink` : Navigation vers `/login`

---

### 3. `register.css` — Styles

#### Structure principale

| Classe | Description |
|--------|-------------|
| `.register-container` | Conteneur flex pleine page |
| `.left-panel` | Panneau gauche 420px avec gradient violet |
| `.right-panel` | Panneau droit flexible, fond `#f7f7fa` |
| `.register-card` | Carte blanche centrée, `max-width: 480px` |

#### Panneau gauche

| Classe | Description |
|--------|-------------|
| `.brand` | Logo + titre flex centré |
| `.brand-icon` | Icône avec fond semi-transparent |
| `.stats-row` | Ligne de 3 statistiques |
| `.stat-value` / `.stat-label` | Valeur en gras + label en petit |
| `.testimonial` | Carte de témoignage avec fond translucide |
| `.testimonial-avatar` | Avatar rond avec icône |

#### Formulaire

| Classe | Description |
|--------|-------------|
| `.role-toggle` | Conteneur des boutons de rôle |
| `.role-btn` | Bouton de rôle (actif = fond violet clair + bordure) |
| `.form-group` | Groupe label + input |
| `.form-row` | Ligne côte à côte (Nom + Prénom) |
| `.input-wrapper` | Conteneur input avec icône et bordure arrondie |
| `.form-input` | Champ texte sans bordure |
| `.toggle-password` | Bouton œil pour voir/masquer le mot de passe |

#### Barre de force du mot de passe

| Classe | Description |
|--------|-------------|
| `.strength-bar` | Conteneur flex des 4 segments |
| `.strength-segment` | Segment individuel (4px de haut) |
| `.strength-segment.active.weak` | Rouge (`#f44336`) |
| `.strength-segment.active.medium` | Orange (`#ff9800`) |
| `.strength-segment.active.strong` | Vert (`#4caf50`) |

#### Messages d'état

| Classe | Description |
|--------|-------------|
| `.error-message` | Fond rose, texte rouge, icône erreur |
| `.success-message` | Fond vert clair, texte vert, icône check |

#### Responsive

| Breakpoint | Comportement |
|------------|-------------|
| `≤ 900px` | Le panneau gauche disparaît |
| `≤ 500px` | Nom + Prénom passent en colonne |

---

## Routing

Route ajoutée dans `app.routes.ts` :

```typescript
{
  path: 'register',
  loadComponent: () => import('./pages/register/register').then((m) => m.Register),
}
```

- **Chemin** : `/register`
- **Lazy-loaded** : Le composant est chargé à la demande
- **Pas de garde** : La page est publique (pas d'`authGuard`)

---

## Appel API Backend

### Interface `RegisterRequest` (ajoutée dans `auth.model.ts`)

```typescript
export interface RegisterRequest {
  email: string;
  userName: string;
  nom: string;
  prenom: string;
  password: string;
  role: string;
}
```

### Méthode `register()` (ajoutée dans `auth.service.ts`)

```typescript
register(request: RegisterRequest): Observable<void> {
  return this.http.post<void>(`${environment.apiUrl}/users`, request);
}
```

### Correspondance avec le Backend

| Frontend (RegisterRequest) | Backend (CreateUserDto) | Description |
|-----------------------------|------------------------|-------------|
| `email` | `Email` | Adresse email |
| `userName` | `UserName` | Nom d'utilisateur |
| `nom` | `Nom` | Nom de famille |
| `prenom` | `Prenom` | Prénom |
| `password` | `Password` | Mot de passe (en clair, hashé côté serveur) |
| `role` | `Role` | Rôle : "ADMIN" ou "COMMERCIAL" |

### Endpoint Backend

```
POST https://localhost:7210/users
Content-Type: application/json

{
  "email": "olivia@company.com",
  "userName": "olivia_davis",
  "nom": "Davis",
  "prenom": "Olivia",
  "password": "MyP@ss123",
  "role": "COMMERCIAL"
}
```

**Réponse :** `200 OK` (pas de body)

---

## Navigation

```
/register ──(inscription réussie)──→ /login ──(connexion)──→ /dashboard
    ↑                                   │
    └───── "Créer un compte" ───────────┘
    
/login ──── "Se Connecter" ← ── /register
```

Les deux pages sont liées :
- **Login** → lien "Créer un compte" → `/register`
- **Register** → lien "Se Connecter" → `/login`

---

## Thème Visuel

| Élément | Valeur |
|---------|--------|
| Couleur primaire | `#7c5cfc` (violet) |
| Gradient gauche | `#7c5cfc` → `#4a1fb8` |
| Fond droit | `#f7f7fa` |
| Carte fond | `#fff` |
| Border radius carte | `20px` |
| Border radius inputs | `12px` |
| Erreur | `#d32f2f` (rouge) |
| Succès | `#2e7d32` (vert) |
| Force faible | `#f44336` |
| Force moyenne | `#ff9800` |
| Force forte | `#4caf50` |
