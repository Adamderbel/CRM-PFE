using CRM.Entities.Common;
using CRM.Entities.Crm;
using CRM.Worker.dtos;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Net.NetworkInformation;

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


        public async Task UpsertCommandesAsync(List<CermCommande> commandes)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            foreach (var c in commandes)
            {
                var cmd = new SqlCommand(@"
MERGE comm.CERM_commande AS target
USING (SELECT @RefCommande AS ref_commande) AS source
ON target.ref_commande = source.ref_commande

WHEN MATCHED THEN
    UPDATE SET
        client_id = @ClientId,
        site_id = @SiteId,
        date_commande = @DateCommande,
        date_livraison_prevue = @DateLivraisonPrevue,
        date_livraison_reelle = @DateLivraisonReelle,
        statut_commande = @StatutCommande

WHEN NOT MATCHED THEN
    INSERT (
        ref_commande,
        client_id,
        site_id,
        date_commande,
        date_livraison_prevue,
        date_livraison_reelle,
        statut_commande
    )
    VALUES (
        @RefCommande,
        @ClientId,
        @SiteId,
        @DateCommande,
        @DateLivraisonPrevue,
        @DateLivraisonReelle,
        @StatutCommande
    );", conn);

                // =====================
                // PARAMÈTRES SAFE
                // =====================
                cmd.Parameters.AddWithValue("@RefCommande", c.RefCommande ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ClientId", (object?)c.ClientId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@SiteId", (object?)c.SiteId ?? DBNull.Value);

                cmd.Parameters.AddWithValue("@DateCommande", (object?)c.DateCommande ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@DateLivraisonPrevue", (object?)c.DateLivraisonPrevue ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@DateLivraisonReelle", (object?)c.DateLivraisonReelle ?? DBNull.Value);

                cmd.Parameters.AddWithValue("@StatutCommande", (object?)c.StatutCommande ?? DBNull.Value);

                await cmd.ExecuteNonQueryAsync();
            }
        }
        public async Task UpsertCommandesLignesAsync(List<CermCommandeLigne> lignes)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            foreach (var l in lignes)
            {
                var cmd = new SqlCommand(@"
MERGE comm.CERM_commandeLigne AS target
USING (
    SELECT @RefCommande AS RefCommande,
           @LigneId AS LigneId
) AS source
ON target.ref_commande = source.RefCommande
AND target.ligne_id = source.LigneId

WHEN MATCHED THEN
    UPDATE SET
        produit_id = @ProduitId,
        client_id = @ClientId,
        qte_commandee = @QteCommandee,
        qte_expediee = @QteExpediee,
        statut_ligne = @StatutLigne,
        date_commande = @DateCommande,
        date_livraison_prevue = @DateLivraisonPrevue,
        date_livraison_reelle = @DateLivraisonReelle

WHEN NOT MATCHED THEN
    INSERT (
        ref_commande,
        ligne_id,
        produit_id,
        client_id,
        qte_commandee,
        qte_expediee,
        statut_ligne,
        date_commande,
        date_livraison_prevue,
        date_livraison_reelle
    )
    VALUES (
        @RefCommande,
        @LigneId,
        @ProduitId,
        @ClientId,
        @QteCommandee,
        @QteExpediee,
        @StatutLigne,
        @DateCommande,
        @DateLivraisonPrevue,
        @DateLivraisonReelle
    );
", conn);

                cmd.Parameters.AddWithValue("@RefCommande", l.RefCommande);
                cmd.Parameters.AddWithValue("@LigneId", l.LigneId);
                cmd.Parameters.AddWithValue("@ProduitId", (object?)l.ProduitId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ClientId", (object?)l.ClientId ?? DBNull.Value);

                cmd.Parameters.AddWithValue("@QteCommandee", (object?)l.QteCommandee ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@QteExpediee", (object?)l.QteExpediee ?? DBNull.Value);

                cmd.Parameters.AddWithValue("@StatutLigne", (object?)l.StatutLigne ?? DBNull.Value);

                cmd.Parameters.AddWithValue("@DateCommande", (object?)l.DateCommande ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@DateLivraisonPrevue", (object?)l.DateLivraisonPrevue ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@DateLivraisonReelle", (object?)l.DateLivraisonReelle ?? DBNull.Value);

                await cmd.ExecuteNonQueryAsync();
            }
        }
        public async Task<List<LigneProspectionUpdateProduit>> GetLignesSansRefProduitAsync()
        {
            var list = new List<LigneProspectionUpdateProduit>();

            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
                    SELECT 
                      lp.Id,
                      lp.CodeCRM,
                         p.UserId
                        FROM crm.LigneProspections lp
                        LEFT JOIN crm.Prospection p ON p.Id = lp.ProspectionId
                            WHERE lp.RefArt IS NULL
                            AND lp.CodeCRM IS NOT NULL";

            using var cmd = new SqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new LigneProspectionUpdateProduit
                {
                    Id = reader.GetGuid(0),
                    CodeCRM = reader.GetString(1),
                    UserId =  reader.GetGuid(2)
                });
            }

            return list;
        }
        public async Task UpdateRefProduitAsync(Guid id, string refProduit)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
UPDATE crm.LigneProspections
SET RefArt = @RefProduit
WHERE Id = @Id";

            using var cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@RefProduit", refProduit);

            await cmd.ExecuteNonQueryAsync();
        }
        public async Task<List<ProspectUpdateClientCerm>> GetProspectsSansClientCermAsync()
        {
            var list = new List<ProspectUpdateClientCerm>();

            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
SELECT DISTINCT
    p.Id, 
    p.CodeCRM,
    pr.UserId
FROM crm.prospect p
INNER JOIN crm.Prospection pr ON pr.ProspectId = p.Id
WHERE p.ClientCermId IS NULL
AND p.CodeCRM IS NOT NULL
AND pr.UserId IS NOT NULL";

            using var cmd = new SqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new ProspectUpdateClientCerm
                {
                    Id = reader.GetGuid(0),
                    CodeCRM = reader.GetString(1),
                    UserId =  reader.GetGuid(2)
                });
            }

            return list;
        }
        public async Task UpdateClientCermProspectAsync(Guid id, string clientCermId)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
            UPDATE crm.prospect
            SET ClientCermId = @ClientCermId
             WHERE Id = @Id";

            using var cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@ClientCermId", clientCermId);

            await cmd.ExecuteNonQueryAsync();
        }




        public async Task<List<LigneProspection>> GetLignesProspectionSansCmdAsync()
        {
            var list = new List<LigneProspection>();

            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
SELECT 
    lp.Id,
    lp.RefArt,
    pr.UserId
FROM crm.LigneProspections lp
INNER JOIN crm.Prospection pr ON pr.Id = lp.ProspectionId
WHERE (lp.NumeroCommande IS NULL OR lp.NumeroCommande = '')
  AND (lp.DateCommande IS NULL)";

            using var cmd = new SqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new LigneProspection
                {
                    Id = reader.GetGuid(0),
                    RefArt = reader.IsDBNull(1) ? null : reader.GetString(1),
                    UserId =  reader.GetGuid(2)
                });
            }

            return list;
        }


        public async Task<CommandeCermResult?> GetCommandeFromLigneAsync(
 string refProduit)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
SELECT TOP 1
    ref_commande,
    date_commande
FROM comm.CERM_commandeLigne
WHERE 
 produit_id = @RefProduit
ORDER BY date_commande ASC";

            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@RefProduit", refProduit);

            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new CommandeCermResult
                {
                    RefCommande = reader.IsDBNull(0) ? null : reader.GetString(0),
                    DateCommande = reader.IsDBNull(1) ? null : reader.GetDateTime(1)
                };
            }

            return null;
        }
        public async Task UpdateCommandeLigneProspectionAsync(
    Guid id,
    string numeroCommande,
    DateTime? dateCommande)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
UPDATE crm.LigneProspections
SET 
    NumeroCommande = @NumeroCommande,
    DateCommande = @DateCommande,
    Concretisee = 1
WHERE Id = @Id";

            using var cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@NumeroCommande", (object?)numeroCommande ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@DateCommande", (object?)dateCommande ?? DBNull.Value);

            await cmd.ExecuteNonQueryAsync();
        }


        public async Task CreateNotificationAsync(
    Guid userId,
    string type,
    string titre,
    string message)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
INSERT INTO crm.Notifications
(
    Id,
    UserId,
    TypeNotification,
    Titre,
    Message,
    Lu,
    DateCreation
)
VALUES
(
    @Id,
    @UserId,
    @TypeNotification,
    @Titre,
    @Message,
    0,
    GETDATE()
)";

            using var cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@Id", Guid.NewGuid());

            cmd.Parameters.AddWithValue("@UserId", userId);

            cmd.Parameters.AddWithValue("@TypeNotification", type);

            cmd.Parameters.AddWithValue("@Titre", titre);

            cmd.Parameters.AddWithValue("@Message", message);

            await cmd.ExecuteNonQueryAsync();
        }


        public async Task<List<LigneProspection>> GetLignesProspectionSansDevisAsync()
        {
            var list = new List<LigneProspection>();

            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
SELECT
    lp.Id,
    lp.RefArt,
    prosp.ClientCermId,
    p.UserId
FROM crm.LigneProspections lp
INNER JOIN crm.Prospection p
    ON lp.ProspectionId = p.Id
INNER JOIN crm.prospect prosp
    ON p.ProspectId = prosp.Id
WHERE (lp.NumeroDevis IS NULL OR lp.NumeroDevis = '')
AND lp.DateDevis IS NULL
AND lp.RefArt IS NOT NULL
AND prosp.ClientCermId IS NOT NULL";

            using var cmd = new SqlCommand(query, conn);

            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new LigneProspection
                {
                    Id = reader.GetGuid(0),

                    RefArt = reader.IsDBNull(1)
                        ? null
                        : reader.GetString(1),

                    ClientCermId = reader.IsDBNull(2)
                        ? null
                        : reader.GetString(2),

                    UserId = reader.GetGuid(3)
                });
            }

            return list;
        }
        public async Task UpdateDevisLigneProspectionAsync(
    Guid id,
    string numeroDevis,
    DateTime? dateDevis)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
UPDATE crm.LigneProspections
SET
    NumeroDevis = @NumeroDevis,
    DateDevis = @DateDevis
WHERE Id = @Id";

            using var cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@Id", id);

            cmd.Parameters.AddWithValue(
                "@NumeroDevis",
                (object?)numeroDevis ?? DBNull.Value);

            cmd.Parameters.AddWithValue(
                "@DateDevis",
                (object?)dateDevis ?? DBNull.Value);

            await cmd.ExecuteNonQueryAsync();
        }


    }
}