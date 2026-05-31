using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Entities.Common
{
    [Table("CERM_commande", Schema = "comm")]
    public class CermCommande
    {
        [Key]
        [Column("ref_commande")]
        public string RefCommande { get; set; }

        [Column("reference_commande")]
        public string? ReferenceCommande { get; set; }

        [Column("client_id")]
        public string? ClientId { get; set; }

        [Column("site_id")]
        public string? SiteId { get; set; }

        [Column("date_commande")]
        public DateTime? DateCommande { get; set; }

        [Column("date_livraison_prevue")]
        public DateTime? DateLivraisonPrevue { get; set; }

        [Column("date_livraison_reelle")]
        public DateTime? DateLivraisonReelle { get; set; }

        [Column("statut_commande")]
        public string? StatutCommande { get; set; }
    }
}