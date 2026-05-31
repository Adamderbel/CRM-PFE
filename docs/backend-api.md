# Backend API (CRM.WebAPI)

## Base URL (Development)

See [launchSettings.json](../CRM.WebAPI/Properties/launchSettings.json).

- https://localhost:7210
- http://localhost:5298

Swagger UI is enabled in development and is configured at `/` in [Program.cs](../CRM.WebAPI/Program.cs).

## Authentication

### Login

- `POST /api/login`
- Controller: [AuthController](../CRM.WebAPI/Controllers/AuthController.cs)
- Returns: JWT token + expiration + user profile + roles

### Create User

- `POST /api/users`
- Controller: [AuthController](../CRM.WebAPI/Controllers/AuthController.cs)
- Optional behavior: if `RefClient` is set, the API links the created user to a `ClientCerm` record.

## Main Endpoints (By Controller)

Routes are defined using ASP.NET attributes directly in the controllers.

### ProspectController

Base route: `api/Prospect` (controller name-based)

- `GET /api/Prospect`
- `GET /api/Prospect/getAllDapper`
- `GET /api/Prospect/{id}`
- `POST /api/Prospect`
- `PUT /api/Prospect/{id}`
- `DELETE /api/Prospect/{id}`

Source: [ProspectController](../CRM.WebAPI/Controllers/ProspectController.cs)

### ProspectionController

Base route: `api/Prospection`

- `POST /api/Prospection`
- `GET /api/Prospection`
- `GET /api/Prospection/{id}`
- `GET /api/Prospection/prospect/{prospectId}`
- `PUT /api/Prospection/{id}`
- `DELETE /api/Prospection/{id}`

Source: [ProspectionController](../CRM.WebAPI/Controllers/ProspectionController.cs)

### LigneProspectionController

Base route: `api/LigneProspection`

- `GET /api/LigneProspection`
- `GET /api/LigneProspection/{id}`
- `POST /api/LigneProspection`
- `PUT /api/LigneProspection/{id}`
- `POST /api/LigneProspection/{id}/close`
- `POST /api/LigneProspection/{id}/devis`

Source: [LigneProspectionController](../CRM.WebAPI/Controllers/LigneProspectionController.cs)

### ActionsProspectionController

Base route: `api/ActionsProspection`

- `GET /api/ActionsProspection/prospection/{prospectionId}`
- `GET /api/ActionsProspection/ligne/{ligneId}`
- `GET /api/ActionsProspection/{id}`
- `GET /api/ActionsProspection/last/{prospectionId}`
- `POST /api/ActionsProspection`
- `PUT /api/ActionsProspection`
- `DELETE /api/ActionsProspection/{id}`

Source: [ActionsProspectionController](../CRM.WebAPI/Controllers/ActionsProspectionController.cs)

### ClientCermController

Base route: `api/ClientCerm`

- `GET /api/ClientCerm/recherche?refClient=...&nom=...&limit=100`
- `GET /api/ClientCerm/{id}`
- `GET /api/ClientCerm/user/{userId}`

Source: [ClientCermController](../CRM.WebAPI/Controllers/ClientCermController.cs)

### ProduitCermController

Base route: `api/ProduitCerm`

- `GET /api/ProduitCerm?refArt=...&designation=...&limit=100`
- `GET /api/ProduitCerm/{id}`
- `GET /api/ProduitCerm/recherche?recherche=...`

Source: [ProduitCermController](../CRM.WebAPI/Controllers/produitCermmm/ProduitCermController.cs)

### CommandesController

Base route: `api/commandes`

- `GET /api/commandes/{refCommande}`
- `GET /api/commandes/client/{clientId}`
- `GET /api/commandes/{refCommande}/lignes`
- `GET /api/commandes/{refCommande}/details`

Source: [CommandesController](../CRM.WebAPI/Controllers/CommandesController%20.cs)

### ReclamationController

Base route: `api/Reclamation`

- `GET /api/Reclamation`
- `POST /api/Reclamation`

Source: [ReclamationController](../CRM.WebAPI/Controllers/ReclamationController.cs)

### NotificationsController

Base route: `api/notifications`

- `GET /api/notifications/user/{userId}`
- `PATCH /api/notifications/{id}/read`

Source: [NotificationsController](../CRM.WebAPI/Controllers/NotificationsController.cs)

### Reference Data Controllers

These are read-focused endpoints (typically `GET` list and `GET {id}`):

- DomaineActiviteController: [DomaineActiviteController](../CRM.WebAPI/Controllers/DomaineActiviteController.cs)
- StatutProspectionController: [StatutProspectionController](../CRM.WebAPI/Controllers/StatutProspectionController.cs)
- TypeActionProspectionController: [TypeActionProspectionController](../CRM.WebAPI/Controllers/TypeActionProspectionController.cs)
- CauseEchecController: [CauseEchecController](../CRM.WebAPI/Controllers/CauseEchecController.cs)
- FamilleProduitController: [FamilleProduitController](../CRM.WebAPI/Controllers/FamilleProduitController.cs)
- SupportProduitController: [SupportProduitController](../CRM.WebAPI/Controllers/SupportProduitController.cs)
- SocieteController: [SocieteController](../CRM.WebAPI/Controllers/SocieteController.cs)

## Error Handling

- Global middleware: [ExceptionMiddleware](../CRM.WebAPI/Middlewares/ExceptionMiddleware.cs)
- Business exception type: [BusinessException](../CRM.Core/Exceptions/BusinessException%20.cs)
