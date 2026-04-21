using CRM.Entities.Common;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Worker.services
{
    public class CermService
    {

        private readonly string _connectionString;

        public CermService(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("CERM");
        }

        public async Task<List<ClientCerm>> GetClientsAsync(DateTime lastSyncDate)
        {
            var clients = new List<ClientCerm>();

            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
            SELECT kla__ref, naam____, wij__dat
            FROM klabas__
            WHERE wij__dat > @LastSyncDate";

            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@LastSyncDate", lastSyncDate);

            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var refValue = reader.GetValue(0)?.ToString();

                clients.Add(new ClientCerm
                {
                    RefClient = int.TryParse(refValue, out var id) ? id : 0,
                    Nom = reader.IsDBNull(1) ? null : reader.GetString(1).Trim(),
                    LastModifiedDate = reader.IsDBNull(2) ? null : reader.GetDateTime(2)
                });
            }

            return clients;
        }
        public async Task<List<ProduitCerm>> GetProduitsAsync(DateTime lastSyncDate)
        {
            var produits = new List<ProduitCerm>();

            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
        SELECT afg__ref, afg_oms1, wij__dat
        FROM afgart__
        WHERE wij__dat > @LastSyncDate";

            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@LastSyncDate", lastSyncDate);

            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                produits.Add(new ProduitCerm
                {
                    RefProduit = int.Parse(reader.GetValue(0).ToString()),
                    Designation = reader.IsDBNull(1) ? null : reader.GetString(1).Trim(),
                    LastModifiedDate = reader.IsDBNull(2) ? null : reader.GetDateTime(2)
                });
            }

            return produits;
        }
    }
}