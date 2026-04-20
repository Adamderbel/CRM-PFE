using CRM.Worker.services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Worker.workers
{
    public class Worker : BackgroundService
    {
        private readonly SyncService _sync;

        public Worker(SyncService sync)
        {
            _sync = sync;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await _sync.SyncClientsAsync();

                Console.WriteLine("Sync OK");

                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }
}
