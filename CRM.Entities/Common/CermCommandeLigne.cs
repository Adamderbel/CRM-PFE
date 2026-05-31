using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Entities.Common
{
    [Table("CERM_commandeLigne", Schema = "comm")]
    public class CermCommandeLigne
    {
        [Key]
        [Column("ligne_id")]
        public string LigneId { get; set; }

        [Column("ref_commande")]
        public string RefCommande { get; set; }

        [Column("produit_id")]
        public string ProduitId { get; set; }

        [Column("client_id")]
        public string ClientId { get; set; }

        [Column("qte_commandee")]
        public decimal? QteCommandee { get; set; }

        [Column("qte_expediee")]
        public decimal? QteExpediee { get; set; }

        [Column("statut_ligne")]
        public string StatutLigne { get; set; }

        [Column("date_commande")]
        public DateTime? DateCommande { get; set; }

        [Column("date_livraison_prevue")]
        public DateTime? DateLivraisonPrevue { get; set; }

        [Column("date_livraison_reelle")]
        public DateTime? DateLivraisonReelle { get; set; }
    }
}
