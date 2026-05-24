# Local Setup

## Prerequisites

- .NET SDK 8.x
- Node.js + npm (see [CRM.WEB/package.json](../CRM.WEB/package.json) for the expected npm version)
- SQL Server (LocalDB, local instance, or remote instance)

## Repository Entry Points

- API startup: [CRM.WebAPI/Program.cs](../CRM.WebAPI/Program.cs)
- Worker startup: [CRM.Worker/Program.cs](../CRM.Worker/Program.cs)
- Angular startup: [CRM.WEB/src/main.ts](../CRM.WEB/src/main.ts)

## Database

This repo includes a SQL Server database project: [CRM.Database](../CRM.Database).

Typical setup options:

1. Publish the database project to a SQL Server instance.
2. Or create the database manually and run the scripts from:
   - [CRM.Database/Tables](../CRM.Database/Tables)
   - [CRM.Database/Stored Procedures](../CRM.Database/Stored%20Procedures)
   - [CRM.Database/Scripts/Referential](../CRM.Database/Scripts/Referential)

Update the connection string in:

- [CRM.WebAPI/appsettings.Development.json](../CRM.WebAPI/appsettings.Development.json)
- [CRM.Worker/appsettings.Development.json](../CRM.Worker/appsettings.Development.json)

## Run the Backend API (CRM.WebAPI)

From `Repos/CRM.WebAPI`:

```bash
dotnet restore
dotnet run
```

Default dev URLs are configured in [launchSettings.json](../CRM.WebAPI/Properties/launchSettings.json):

- https://localhost:7210
- http://localhost:5298

Swagger UI is enabled in development and is configured to run at the root path (`/`) in [Program.cs](../CRM.WebAPI/Program.cs).

## Run the Frontend (CRM.WEB)

From `Repos/CRM.WEB`:

```bash
npm install
npm run start
```

The Angular dev proxy routes `/api/*` to the backend at `https://localhost:7210`:

- [proxy.conf.json](../CRM.WEB/proxy.conf.json)

If you want the proxy to be used automatically, ensure Angular is started with that proxy configuration (either via `angular.json` or by passing `--proxy-config proxy.conf.json`).

## Run the Worker (CRM.Worker)

From `Repos/CRM.Worker`:

```bash
dotnet restore
dotnet run
```

The worker will call sync methods in a loop (see [Worker](../CRM.Worker/workers/Worker%20.cs)).

## Configuration Notes (Security)

Do not commit real secrets in `appsettings.json` (JWT keys, SMTP passwords, etc.). Use environment variables, user-secrets, or a secret manager and rotate any leaked credentials.
