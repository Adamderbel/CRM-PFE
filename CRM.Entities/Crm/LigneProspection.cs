using CRM.Entities.Comm;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRM.Entities.Crm
{
    [Table("LigneProspections", Schema = "crm")]
    public class LigneProspection
    {
        [Key]
        public Guid Id { get; set; }

        public string? Designation { get; set; }

        public DateTime? DateDemandeOffre { get; set; }

        public string? NumeroDevis { get; set; }

        public DateTime? DateDevis { get; set; }

        public string? NumeroCommande { get; set; }

        public DateTime? DateCommande { get; set; }

        public bool BatEnvoyee { get; set; }

        public DateTime? DateEnvoiBat { get; set; }

        public bool Concretisee { get; set; }

        public int? CauseEchecId { get; set; }

        public string? RefArt { get; set; }

        public int FamilleProduitId { get; set; }

        public int? SupportProduitId { get; set; }

        public Guid ProspectionId { get; set; }

        public int? SocieteeId { get; set; }

        public int? StatutId { get; set; }

        public DateTime Date { get; set; }


        // Navigation Properties

        [ForeignKey("CauseEchecId")]
        public CauseEchec? CauseEchec { get; set; }

        [ForeignKey("FamilleProduitId")]
        public FamilleProduit? FamilleProduit { get; set; }

        [ForeignKey("SupportProduitId")]
        public SupportProduit? SupportProduit { get; set; }

        [ForeignKey("ProspectionId")]
        public Prospection? Prospection { get; set; }

        [ForeignKey("SocieteeId")]
        public Societee? Societee { get; set; }

        [ForeignKey("StatutId")]
        public StatutProspection? Statut { get; set; }
        public  String? CodeCRM { get; set; }
        [NotMapped]
        public Guid UserId { get; set; }
        [NotMapped]
        public string? ClientCermId { get; set; }
    }
}