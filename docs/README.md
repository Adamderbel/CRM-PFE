# CRM Hub Documentation

This repository contains a CRM system with:

- A REST API (ASP.NET Core / .NET 8): [CRM.WebAPI](../CRM.WebAPI)
- A web UI (Angular 21): [CRM.WEB](../CRM.WEB)
- A background sync worker (ASP.NET Worker Service / .NET 8): [CRM.Worker](../CRM.Worker)
- Data access layers (EF Core + Dapper): [CRM.DAL](../CRM.DAL), [CRM.Services](../CRM.Services), [CRM.Entities](../CRM.Entities)
- A SQL Server database project: [CRM.Database](../CRM.Database)

## Start Here

- [System Overview](system-overview.md)
- [Local Setup](setup.md)
- [Architecture](architecture.md)
- [Backend (API)](backend-api.md)
- [Frontend (Angular)](frontend.md)
- [Database](database.md)
- [Worker (Sync Jobs)](worker.md)
- [Backlog / Report Tasks](backlog.md)

## What This System Does (Functional Summary)

- Authentication: users login and receive a JWT; the UI stores it and sends it on API requests.
- Commercial (Sales) features: manage prospects, prospections, and follow-up actions/lines.
- Client features: view own commandes (orders) and order lines; create/view reclamations.
- Admin features: manage referential data (settings) and employees/users (role-based).
- Integration: worker jobs sync data from an external system ("CERM") into CRM and create notifications.
