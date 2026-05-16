using CRM.Entities.Common;
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


        // =========================
        // SYNC COMMANDES ONLY
        // =========================
        public async Task SyncCommandesAsync()
        {
            Console.WriteLine("SYNC COMMANDES START");

            try
            {
                // 1. GET DATA FROM CERM (déjà agrégé + statut calculé en SQL)
                var commandes = await _cerm.GetCommandesAsync();

                if (commandes == null || commandes.Count == 0)
                {
                    Console.WriteLine("Aucune commande à synchroniser");
                    return;
                }

                Console.WriteLine($"Commandes trouvées: {commandes.Count}");

                // 2. UPSERT INTO CRM
                await _crm.UpsertCommandesAsync(commandes);

                Console.WriteLine("SYNC COMMANDES END SUCCESS");
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR SYNC COMMANDES: " + ex.Message);
                throw;
            }
        }
        public async Task SyncCommandesLignesAsync()
        {
            Console.WriteLine("Sync Commandes Lignes");

            var lignes = await _cerm.GetCommandesLignesAsync();

            if (lignes == null || lignes.Count == 0)
                return;

            await _crm.UpsertCommandesLignesAsync(lignes);
        }

        public async Task SyncRefProduitProspectionAsync()
        {
            Console.WriteLine("Sync Ref Produit Prospect");

            var lignes = await _crm.GetLignesSansRefProduitAsync();

            if (lignes == null || lignes.Count == 0)
                return;

            foreach (var ligne in lignes)
            {
                if (string.IsNullOrWhiteSpace(ligne.CodeCRM))
                    continue;

                var refProduit = await _cerm.GetRefProduitByCodeCrmAsync(ligne.CodeCRM);

                if (string.IsNullOrWhiteSpace(refProduit))
                    continue;

                await _crm.UpdateRefProduitAsync(ligne.Id, refProduit);
                await _crm.CreateNotificationAsync(
    ligne.UserId,
    "PRODUIT_SYNC",
    "PRODUIT_SYNC",
    $"Produit affecté à la ligne {ligne.Id}"
        );
            }
        }
        public async Task SyncProspectClientCermAsync()
        {
            Console.WriteLine("Sync Prospect Client CERM");

            var prospects = await _crm.GetProspectsSansClientCermAsync();

            if (prospects == null || prospects.Count == 0)
                return;

            foreach (var prospect in prospects)
            {
                if (string.IsNullOrWhiteSpace(prospect.CodeCRM))
                    continue;

                var clientCermId = await _cerm.GetClientCermByCodeCrmAsync(prospect.CodeCRM);

                if (string.IsNullOrWhiteSpace(clientCermId))
                    continue;

                await _crm.UpdateClientCermProspectAsync(prospect.Id, clientCermId);
                await _crm.CreateNotificationAsync(
                            prospect.UserId,
                            "PROSPECT_UPDATED",
                            "PROSPECT_UPDATED",
                              $"Le prospect {prospect.Id} a été enrichi avec ClientCermId {clientCermId}"
);
            }
        }
        public async Task SyncCommandesProspectionAsync()
        {
            Console.WriteLine("=== SYNC PROSPECTION → CERM ===");

            var lignes = await _crm.GetLignesProspectionSansCmdAsync();

            if (lignes == null || lignes.Count == 0)
            {
                Console.WriteLine("Aucune ligne à traiter");
                return;
            }

            foreach (var ligne in lignes)
            {
                if (
                    string.IsNullOrEmpty(ligne.RefArt))
                    continue;

                var commande = await _crm.GetCommandeFromLigneAsync(
                    ligne.RefArt);

                if (commande == null)
                    continue;

                await _crm.UpdateCommandeLigneProspectionAsync(
                    ligne.Id,
                    commande.RefCommande!,
                    commande.DateCommande);

                await _crm.CreateNotificationAsync(
                  ligne.UserId,
                    "COMMANDE_SYNC",
                     "COMMANDE_SYNC",
                     $"Commande {commande.RefCommande} reçue. Ligne de prospection concrétisée."
);

                Console.WriteLine($"OK -> {ligne.Id} | {commande.RefCommande}");
            }

            Console.WriteLine("=== SYNC TERMINÉ ===");
        }
        public async Task SyncDevisProspectionAsync()
        {
            Console.WriteLine("=== SYNC DEVIS PROSPECTION ===");

            var lignes = await _crm.GetLignesProspectionSansDevisAsync();

            if (lignes == null || lignes.Count == 0)
                return;

            foreach (var ligne in lignes)
            {
                if (
                    string.IsNullOrWhiteSpace(ligne.RefArt)
                    || string.IsNullOrWhiteSpace(ligne.ClientCermId))
                    continue;

                var devis = await _cerm.GetDevisFromLigneAsync(
                    ligne.RefArt,
                    ligne.ClientCermId);

                if (devis == null)
                    continue;

                await _crm.UpdateDevisLigneProspectionAsync(
                    ligne.Id,
                    devis.NumeroDevis!,
                    devis.DateDevis);

                // =========================
                // NOTIFICATION
                // =========================

                 await _crm.CreateNotificationAsync(
                        ligne.UserId,
                        "Devis reçu depuis CERM",
                        "Devis reçu depuis CERM",

                        $"Le devis {devis.NumeroDevis} a été reçu pour la ligne de prospection.");
                

                Console.WriteLine(
                    $"DEVIS OK -> {ligne.Id} | {devis.NumeroDevis}");
            }

            Console.WriteLine("=== FIN SYNC DEVIS ===");
        }
    }
}