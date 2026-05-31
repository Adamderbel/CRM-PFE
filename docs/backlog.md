# Backlog / Report Tasks

This backlog is designed to be copy/pasted into a project report (PFE) or used as an implementation plan.

## High Priority (Security / Correctness)

- Remove secrets from config files and rotate credentials
  - Risk: keys/passwords are currently stored in plain text under API/Worker config.
  - Target: move to environment variables, user-secrets, or a secret manager and rotate leaked secrets.
  - References: [CRM.WebAPI/appsettings.json](../CRM.WebAPI/appsettings.json), [CRM.Worker/appsettings.json](../CRM.Worker/appsettings.json)
- Fix infinite recursion in `UserService.GetRolesByRoleIdAsync`
  - Impact: `StackOverflowException` if called.
  - Reference: [UserService.cs](../CRM.Services/UserService.cs)
- Fix namespace/using mismatch `RepositoriesDupper` vs `RepositoriesDapper`
  - Impact: confusing structure and potential build problems.
  - Reference: [Program.cs](../CRM.WebAPI/Program.cs)
- Avoid returning raw exception details from API endpoints
  - Impact: internal stack traces can leak details to clients.
  - Reference: [AuthController.cs](../CRM.WebAPI/Controllers/AuthController.cs)

## Medium Priority (Performance / Maintainability)

- Remove N+1 query patterns in controllers (per-item service calls inside loops)
  - Impact: API gets slower as data grows.
  - References: [ProspectController.cs](../CRM.WebAPI/Controllers/ProspectController.cs), [ProspectionController.cs](../CRM.WebAPI/Controllers/ProspectionController.cs), [LigneProspectionController.cs](../CRM.WebAPI/Controllers/LigneProspectionController.cs)
- Make worker schedule configurable (instead of hardcoded 5 seconds)
  - Reference: [Worker.cs](../CRM.Worker/workers/Worker%20.cs)
- Standardize role names and casing across backend + frontend
  - Reference (frontend expectations): [app.routes.ts](../CRM.WEB/src/app/app.routes.ts)
- Clarify EF Core schema/table mapping for CRM domain
  - DataContext does not currently set a default schema; confirm that physical tables match EF defaults or add explicit mapping.
  - References: [DataContext](../CRM.DAL/DBContexts/DataContext.cs), [CRM.Database/Tables](../CRM.Database/Tables)

## Product Improvements

- Add pagination/sorting to list endpoints and Angular tables (prospects, prospections, reclamations, commandes).
- Add audit fields and change history (who updated what and when) for CRM records.
- Add richer notification types and a UI inbox experience (filters, mark-all-read).
- Improve validation: consistent DTO validation rules and clear error messages.

## Quality (Testing / Tooling)

- Add backend unit tests for services (business rules, repository behavior).
- Add API integration tests (auth, core CRUD, worker sync paths).
- Add frontend component tests for pages and guards.
