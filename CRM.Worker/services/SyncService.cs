using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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

        public async Task SyncClientsAsync()
        {
            var lastSyncDate = await _crm.GetLastSyncDateAsync();

            var clients = await _cerm.GetClientsAsync(lastSyncDate);

            if (clients == null || clients.Count == 0)
                return;

            await _crm.UpsertClientsAsync(clients);

            var maxDate = clients
                .Where(x => x.LastModifiedDate.HasValue)
                .Select(x => x.LastModifiedDate.Value)
                .DefaultIfEmpty(lastSyncDate)
                .Max();

            await _crm.UpdateLastSyncDateAsync(maxDate);
        }
    }
}
