using CRM.Entities.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace CRM.Worker.services
{
    public class CrmService
    {
        private readonly string _connectionString;

        public CrmService(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("CRM");
        }

        // ===================== METADATA =====================

        public async Task<DateTime> GetLastSyncDateAsync(string entityName)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            var cmd = new SqlCommand(@"
                SELECT LastSyncDate 
                FROM comm.SyncMetadata 
                WHERE EntityName = @EntityName", conn);

            cmd.Parameters.AddWithValue("@EntityName", entityName);

            var result = await cmd.ExecuteScalarAsync();

            if (result == null || result == DBNull.Value)
                return DateTime.MinValue;

            return (DateTime)result;
        }

        public async Task UpdateLastSyncDateAsync(string entityName, DateTime date)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            var cmd = new SqlCommand(@"
                UPDATE comm.SyncMetadata 
                SET LastSyncDate = @date 
                WHERE EntityName = @EntityName", conn);

            cmd.Parameters.AddWithValue("@EntityName", entityName);
            cmd.Parameters.AddWithValue("@date", date);

            await cmd.ExecuteNonQueryAsync();
        }

        // ===================== CLIENTS =====================

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

        // ===================== PRODUITS =====================

        public async Task UpsertProduitsAsync(List<ProduitCerm> produits)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            foreach (var p in produits)
            {
                var cmd = new SqlCommand(@"
MERGE comm.ProduitCerm AS target
USING (SELECT @RefProduit AS RefProduit) AS source
ON target.RefProduit = source.RefProduit

WHEN MATCHED THEN
    UPDATE SET 
        Designation = @Designation,
        LastModifiedDate = @LastModifiedDate,
        LastSyncDate = GETDATE()

WHEN NOT MATCHED THEN
    INSERT (RefProduit, Designation, LastModifiedDate, LastSyncDate)
    VALUES (@RefProduit, @Designation, @LastModifiedDate, GETDATE());", conn);

                cmd.Parameters.AddWithValue("@RefProduit", p.RefProduit);
                cmd.Parameters.AddWithValue("@Designation", (object?)p.Designation ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@LastModifiedDate", (object?)p.LastModifiedDate ?? DBNull.Value);

                await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}