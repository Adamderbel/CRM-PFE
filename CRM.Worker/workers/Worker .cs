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
            Console.WriteLine("🚀 Worker START");

            while (!stoppingToken.IsCancellationRequested)
            {
                Console.WriteLine("🔄 BEFORE SYNC");

                try
                {
                    await _sync.SyncClientsAsync();
                    await _sync.SyncProduitsAsync();
                    Console.WriteLine("✅ AFTER SYNC");
                }
                catch (Exception ex)
                {
                    Console.WriteLine("❌ WORKER ERROR: " + ex.Message);
                }

                await Task.Delay(5000, stoppingToken);
            }
        }
    }
}
