# Database

The database is defined in the SQL Server database project: [CRM.Database](../CRM.Database).

## Schemas

Schema scripts live in [CRM.Database/Schemas](../CRM.Database/Schemas):

- `crm` (main CRM domain)
- `sec` (security / Identity)
- `comm` (integration-related tables, stored procedures)

Related constants exist in [SqlConstants.cs](../CRM.DAL/SqlConstants.cs).

## Tables

Tables are defined as `.sql` files under [CRM.Database/Tables](../CRM.Database/Tables).

Examples (non-exhaustive):

- CRM domain:
  - Prospect, Prospection, LigneProspections
  - TypeActionProspection, ActionsProspection
  - Reclamation, Notifications
  - DomaineActivites, StatutProspection, CauseEchecs, Societees
- Integration data:
  - ClientCerm, ProduitCerm, CRM_Commande, CERM_commandeLigne
- Security:
  - Users, Roles, UserRoles, UserClaims, RoleClaims

## Stored Procedures

Stored procedures are under [CRM.Database/Stored Procedures](../CRM.Database/Stored%20Procedures), for example:

- `crm.GetAllProspect`
- `comm.sp_RechercherProduitCerm`

They are called from Dapper repositories, built on [RepositoryBaseDapper](../CRM.DAL/GenericRepository/RepositoryBaseDapper.cs).

## Seed / Referential Data

Referential scripts are in [CRM.Database/Scripts/Referential](../CRM.Database/Scripts/Referential), including:

- roles
- domaine activitée
- famille produit
- support produit
- statut prospection
- societée
- cause échec
- type action prospection

## EF Core Mapping Notes

- `SecurityDbContext` explicitly sets default schema `sec` and maps Identity tables accordingly: [SecurityDbContext](../CRM.DAL/SecurityDbContext.cs).
- `DataContext` currently does not configure schema/table mappings explicitly: [DataContext](../CRM.DAL/DBContexts/DataContext.cs). If your physical tables are not in the default schema, you may need EF mapping adjustments (or database schema changes) for EF-based CRUD to work.
