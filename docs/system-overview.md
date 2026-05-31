# System Overview

## Projects

The solution is [CRM.sln](../CRM.sln) and contains:

- CRM.WebAPI: REST API (controllers, DTOs, middleware, JWT auth)
- CRM.Services: business/domain services (interfaces + implementations)
- CRM.DAL: data access (EF Core contexts + generic repository + Dapper repositories)
- CRM.Entities: domain entities (CRM + Security)
- CRM.Database: SQL Server database project (schemas, tables, stored procedures, deployment scripts)
- CRM.Worker: background sync worker (periodic jobs)
- CRM.WEB: Angular web application (role-based pages, guards, API services)

## Main User Roles

Roles are used both in the backend (JWT claims) and in the frontend route guard:

- Admin
- Commercial
- Client_User

Frontend role protection is defined in [app.routes.ts](../CRM.WEB/src/app/app.routes.ts).

## Core Business Modules

### Authentication & Users

- API endpoints: `POST /api/login`, `POST /api/users` in [AuthController](../CRM.WebAPI/Controllers/AuthController.cs)
- Output: JWT token + expiration + user profile + roles

### Prospects & Prospections (Commercial)

- Prospects: lead/contact entity and its referential links (ex: domaine d’activité)
  - Controller: [ProspectController](../CRM.WebAPI/Controllers/ProspectController.cs)
- Prospections: activity/opportunity created for a prospect
  - Controller: [ProspectionController](../CRM.WebAPI/Controllers/ProspectionController.cs)
- Prospection lines and actions: detailed follow-up and status changes
  - Controllers: [LigneProspectionController](../CRM.WebAPI/Controllers/LigneProspectionController.cs), [ActionsProspectionController](../CRM.WebAPI/Controllers/ActionsProspectionController.cs)

### Products / Commandes / Reclamations

- Products (CERM):
  - Controller: [ProduitCermController](../CRM.WebAPI/Controllers/produitCermmm/ProduitCermController.cs)
- Commandes (Orders) and their lines/details:
  - Controller: [CommandesController](../CRM.WebAPI/Controllers/CommandesController%20.cs)
- Reclamations (complaints/tickets):
  - Controller: [ReclamationController](../CRM.WebAPI/Controllers/ReclamationController.cs)

### Notifications

- API endpoint group: `api/notifications/*`
  - Controller: [NotificationsController](../CRM.WebAPI/Controllers/NotificationsController.cs)

### Referential (Settings)

These endpoints expose read access to reference data used by forms:

- DomaineActivite: [DomaineActiviteController](../CRM.WebAPI/Controllers/DomaineActiviteController.cs)
- StatutProspection: [StatutProspectionController](../CRM.WebAPI/Controllers/StatutProspectionController.cs)
- TypeActionProspection: [TypeActionProspectionController](../CRM.WebAPI/Controllers/TypeActionProspectionController.cs)
- CauseEchec: [CauseEchecController](../CRM.WebAPI/Controllers/CauseEchecController.cs)
- FamilleProduit: [FamilleProduitController](../CRM.WebAPI/Controllers/FamilleProduitController.cs)
- SupportProduit: [SupportProduitController](../CRM.WebAPI/Controllers/SupportProduitController.cs)
- Societe: [SocieteController](../CRM.WebAPI/Controllers/SocieteController.cs)

## Data Access Overview

- EF Core is used for standard CRUD (DbContexts in [CRM.DAL/DBContexts](../CRM.DAL/DBContexts)).
- Dapper is used for stored-procedure queries and optimized reads:
  - Base: [RepositoryBaseDapper](../CRM.DAL/GenericRepository/RepositoryBaseDapper.cs)
  - Examples: [ProspectRepositoryDapper](../CRM.DAL/RepositoriesDapper/ProspectRepositoryDapper.cs) and other `*RepositoryDapper` classes.

## Background Sync (Worker)

The worker runs periodically and calls sync methods in [SyncService](../CRM.Worker/services/SyncService.cs) from [Worker](../CRM.Worker/workers/Worker%20.cs).
