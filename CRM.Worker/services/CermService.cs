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

        public async Task<List<CermCommande>> GetCommandesAsync()
        {
            var list = new List<CermCommande>();

            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
SELECT 
    bstlyn__.bst__ref AS ref_commande,
    bstlyn__.kla__ref AS client_id,
    bstlyn__.dossier_ AS site_id,

    MIN(bstlyn__.bst__dat) AS date_commande,
    MIN(bstlyn__.vrzvodat) AS date_livraison_prevue,
    MAX(bstlyn__.vrz__dat) AS date_livraison_reelle,

CASE

    -- toutes les lignes sont expédiées
    WHEN COUNT(*) = SUM(CASE WHEN bstlyn__.vrz__tst = 'Y' THEN 1 ELSE 0 END)
        THEN 'Expédiée'

    -- aucune ligne expédiée mais toutes non applicables
    WHEN COUNT(*) = SUM(CASE WHEN bstlyn__.vrz__tst = '0' THEN 1 ELSE 0 END)
        THEN 'Non applicable'

    -- au moins une ligne expédiée
    WHEN SUM(CASE WHEN bstlyn__.vrz__tst = 'Y' THEN 1 ELSE 0 END) > 0
        THEN 'Partiellement expédiée'

    -- toutes les lignes sont prêtes à expédier
    WHEN COUNT(*) = SUM(CASE WHEN bstlyn__.vrz__tst = 'N' THEN 1 ELSE 0 END)
        THEN 'Prêt à expédier'

    -- sinon (inclut 1 + mix N + 1 etc.)
    ELSE 'En cours'

END AS statut_commande

FROM bstlyn__
WHERE trn__srt <> 'R'
GROUP BY 
    bstlyn__.bst__ref,
    bstlyn__.kla__ref,
    bstlyn__.dossier_;
";

            using var cmd = new SqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new CermCommande
                {
                    RefCommande = reader.GetString(0),
                    ClientId = reader.GetValue(1)?.ToString(),
                    SiteId = reader.GetValue(2)?.ToString(),
                    DateCommande = reader.GetDateTime(3),
                    DateLivraisonPrevue = reader.GetDateTime(4),
                    DateLivraisonReelle = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    StatutCommande = reader.GetString(6)
                });
            }

            return list;
        }
        public async Task<List<CermCommandeLigne>> GetCommandesLignesAsync()
        {
            var list = new List<CermCommandeLigne>();

            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
SELECT 
    bstlyn__.bst__ref AS ref_commande,
    bstlyn__.lyn__ref AS ligne_id,

    bstlyn__.afg__ref AS produit_id,
    bstlyn__.kla__ref AS client_id,

    bstlyn__.b_aantal AS qte_commandee,
    bstlyn__.l_aantal AS qte_expediee,

    CASE bstlyn__.vrz__tst
        WHEN '0' THEN 'Non applicable'
        WHEN '1' THEN 'Pas encore prêt'
        WHEN 'N' THEN 'Prêt à expédier'
        WHEN 'Y' THEN 'Expédié'
        ELSE 'Inconnu'
    END AS statut_ligne,

    bstlyn__.bst__dat AS date_commande,
    bstlyn__.vrzvodat AS date_livraison_prevue,
    bstlyn__.vrz__dat AS date_livraison_reelle

FROM bstlyn__
WHERE trn__srt <> 'R';
";

            using var cmd = new SqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new CermCommandeLigne
                {
                    RefCommande = reader.IsDBNull(0) ? null : reader.GetString(0).Trim(),
                    LigneId = reader.IsDBNull(1) ? null : reader.GetString(1).Trim(),

                    ProduitId = reader.IsDBNull(2) ? null : reader.GetString(2).Trim(),
                    ClientId = reader.IsDBNull(3) ? null : reader.GetString(3).Trim(),

                    QteCommandee = reader.IsDBNull(4)
                        ? 0
                        : Convert.ToDouble(reader.GetValue(4)),

                    QteExpediee = reader.IsDBNull(5)
                        ? 0
                        : Convert.ToDouble(reader.GetValue(5)),

                    StatutLigne = reader.IsDBNull(6)
                        ? null
                        : reader.GetString(6).Trim(),

                    DateCommande = reader.IsDBNull(7)
                        ? null
                        : reader.GetDateTime(7),

                    DateLivraisonPrevue = reader.IsDBNull(8)
                        ? null
                        : reader.GetDateTime(8),

                    DateLivraisonReelle = reader.IsDBNull(9)
                        ? null
                        : reader.GetDateTime(9)
                });
            }

            return list;
        }

        public async Task<string?> GetRefProduitByCodeCrmAsync(string codeCrm)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
SELECT TOP 1 det__ref
FROM gegdet__
WHERE tabname_ = 'afgart__'
AND antw_txt = @CodeCRM";

            using var cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@CodeCRM", codeCrm);

            var result = await cmd.ExecuteScalarAsync();

            return result?.ToString()?.Trim();
        }
        public async Task<string?> GetClientCermByCodeCrmAsync(string codeCrm)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string query = @"
            SELECT TOP 1 det__ref
            FROM gegdet__
            WHERE tabname_ = 'klabas__'
            AND antw_txt = @CodeCRM";

            using var cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@CodeCRM", codeCrm);

            var result = await cmd.ExecuteScalarAsync();

            return result?.ToString()?.Trim();
        }
     
    }
}