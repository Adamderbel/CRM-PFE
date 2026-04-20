using CRM.Entities.Common;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Worker.services
{
    public class CrmService
    {
        private readonly string _connectionString;

        public CrmService(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("CRM");
        }

        public async Task<DateTime> GetLastSyncDateAsync()
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            var cmd = new SqlCommand(
                "SELECT LastSyncDate FROM SyncMetadata WHERE EntityName = 'Clients'",
                conn);

            return (DateTime)(await cmd.ExecuteScalarAsync());
        }

        public async Task UpdateLastSyncDateAsync(DateTime date)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            var cmd = new SqlCommand(
                "UPDATE SyncMetadata SET LastSyncDate = @date WHERE EntityName = 'Clients'",
                conn);

            cmd.Parameters.AddWithValue("@date", date);
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task UpsertClientsAsync(List<ClientCerm> clients)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            foreach (var c in clients)
            {
                var cmd = new SqlCommand(@"
MERGE comm.ClientCerm AS target
USING (SELECT @RefClient AS RefClient) AS source
ON target.RefClient = source.RefClient

WHEN MATCHED THEN
    UPDATE SET 
        Nom = @Nom,
        LastModifiedDate = @LastModifiedDate,
        LastSyncDate = GETDATE()

WHEN NOT MATCHED THEN
    INSERT (RefClient, Nom, LastModifiedDate, LastSyncDate)
    VALUES (@RefClient, @Nom, @LastModifiedDate, GETDATE());", conn);

                cmd.Parameters.AddWithValue("@RefClient", c.RefClient);
                cmd.Parameters.AddWithValue("@Nom", (object?)c.Nom ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@LastModifiedDate", (object?)c.LastModifiedDate ?? DBNull.Value);

                await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}
