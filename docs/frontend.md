# Frontend (CRM.WEB)

## Tech

- Angular 21 (standalone bootstrap)
- Angular Router
- Angular Material + Bootstrap

Entry point: [main.ts](../CRM.WEB/src/main.ts)

## API Configuration

- Frontend code uses `'/api'` as the base URL in [environment.ts](../CRM.WEB/src/environments/environment.ts).
- In development, `/api/*` is proxied to the backend (`https://localhost:7210`) via [proxy.conf.json](../CRM.WEB/proxy.conf.json).

## Auth & Role Enforcement

- Token storage + user session: [AuthService](../CRM.WEB/src/app/core/services/auth.service.ts)
- JWT injection into requests: [auth.interceptor.ts](../CRM.WEB/src/app/core/interceptors/auth.interceptor.ts)
- Auth gate: [auth.guard.ts](../CRM.WEB/src/app/core/guards/auth.guard.ts)
- Role gate: [role.guard.ts](../CRM.WEB/src/app/core/guards/role.guard.ts)
- Route map: [app.routes.ts](../CRM.WEB/src/app/app.routes.ts)

Roles used in routes:

- Admin
- Commercial
- Client_User

## Main Screens (Routes)

All routes below are defined in [app.routes.ts](../CRM.WEB/src/app/app.routes.ts).

### Public

- `/login`: login page
- `/register`: registration page

### Commercial (Sales)

- `/dashboard`: main dashboard
- `/clients`: search/list clients (CERM)
- `/products`: search/list products (CERM)
- `/prospects`: list prospects
- `/prospects/create`: create prospect
- `/prospects/edit/:id`: edit prospect
- `/prospects/:id`: prospect details
- `/prospections`: list prospections
- `/prospections/create`: create prospection
- `/prospections/edit/:id`: edit prospection
- `/prospections/detail/:id`: prospection details
- `/ligne-prospections/:prospectionId`: list prospection lines for a prospection
- `/ligne-prospections/create`: create prospection line
- `/ligne-prospections/edit/:id`: edit prospection line
- `/reclamations`: list reclamations (Commercial can view; clients can also access)
- `/reclamations/create`: create reclamation (Commercial-only in routes)

### Client

- `/dashboard-client`: client dashboard
- `/commande-client`: list commandes (orders) for the logged-in client
- `/commande-client/lignes/:refCommande`: order lines for a commande
- `/reclamation-client`: create/view reclamations from the client side
- `/reclamations`: list reclamations

### Admin

- `/dashboard-admin`: admin dashboard
- `/settings`: settings/referentials management
- `/employees`: employees list/management

## API Services (Angular)

API calls are grouped under [src/app/core/services](../CRM.WEB/src/app/core/services), for example:

- [prospect.service.ts](../CRM.WEB/src/app/core/services/prospect.service.ts)
- [prospection.service.ts](../CRM.WEB/src/app/core/services/prospection.service.ts)
- [commande.service.ts](../CRM.WEB/src/app/core/services/commande.service.ts)
- [reclamation.service.ts](../CRM.WEB/src/app/core/services/reclamation.service.ts)
- [client-cerm.service.ts](../CRM.WEB/src/app/core/services/client-cerm.service.ts)
