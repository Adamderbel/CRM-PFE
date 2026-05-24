# Worker (CRM.Worker)

## Purpose

The worker periodically synchronizes data between CRM and an external system referred to as "CERM".

- Loop implementation: [Worker](../CRM.Worker/workers/Worker%20.cs)
- Orchestration: [SyncService](../CRM.Worker/services/SyncService.cs)

## Execution Loop

The worker:

1. Starts and logs basic messages to the console.
2. Executes a set of sync methods.
3. Waits 5 seconds (`Task.Delay(5000)`) and repeats.

The currently enabled sync calls are visible in [Worker](../CRM.Worker/workers/Worker%20.cs). Some methods exist in `SyncService` but are commented out in the worker.

## Sync Jobs (SyncService)

Source: [SyncService](../CRM.Worker/services/SyncService.cs)

### Client and Product Sync

- `SyncClientsAsync()`: fetches clients updated since the last sync date and upserts them into CRM.
- `SyncProduitsAsync()`: fetches products updated since the last sync date and upserts them into CRM.

Both jobs track a per-module last sync timestamp in CRM via `GetLastSyncDateAsync()` and `UpdateLastSyncDateAsync()`.

### Commandes Sync

- `SyncCommandesAsync()`: fetches commandes (orders) from CERM and upserts them into CRM.
- `SyncCommandesLignesAsync()`: fetches commande lines from CERM and upserts them into CRM.

### Prospection Enrichment / Matching

- `SyncProspectClientCermAsync()`: enriches prospects missing `ClientCermId`, based on `CodeCRM`, then creates a notification.
- `SyncRefProduitProspectionAsync()`: fills missing product references on prospection lines, based on `CodeCRM`, then creates a notification.
- `SyncDevisProspectionAsync()`: finds devis from CERM for prospection lines and updates CRM, then creates a notification.
- `SyncCommandesProspectionAsync()`: matches prospection lines to commandes and updates CRM, then creates a notification.
