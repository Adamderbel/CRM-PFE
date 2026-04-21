using System;
using System.Linq;
using System.Threading.Tasks;

namespace CRM.Worker.services
{
    public class SyncService
    {
        private readonly CermService _cerm;
        private readonly CrmService _crm;

        public SyncService(CermService cerm, CrmService crm)
        {
            _cerm = cerm;
            _crm = crm;
        }

        // ===================== CLIENTS =====================
        public async Task SyncClientsAsync()
        {
            Console.WriteLine("syncClient");
            var lastSyncDate = await _crm.GetLastSyncDateAsync("Clients");

            var clients = await _cerm.GetClientsAsync(lastSyncDate);

            if (clients == null || clients.Count == 0)
                return;

            await _crm.UpsertClientsAsync(clients);

            var maxDate = clients
                .Where(x => x.LastModifiedDate.HasValue)
                .Select(x => x.LastModifiedDate.Value)
                .DefaultIfEmpty(lastSyncDate)
                .Max();

            await _crm.UpdateLastSyncDateAsync("Clients", maxDate);
        }

        // ===================== PRODUITS =====================
        public async Task SyncProduitsAsync()
        {
            Console.WriteLine("Product");
            var lastSyncDate = await _crm.GetLastSyncDateAsync("Produits");

            var produits = await _cerm.GetProduitsAsync(lastSyncDate);

            if (produits == null || produits.Count == 0)
                return;

            await _crm.UpsertProduitsAsync(produits);

            var maxDate = produits
                .Where(x => x.LastModifiedDate.HasValue)
                .Select(x => x.LastModifiedDate.Value)
                .DefaultIfEmpty(lastSyncDate)
                .Max();

            await _crm.UpdateLastSyncDateAsync("Produits", maxDate);
        }
    }
}