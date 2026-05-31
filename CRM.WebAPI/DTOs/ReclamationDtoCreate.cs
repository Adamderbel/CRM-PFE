using System.ComponentModel.DataAnnotations;

namespace CRM.WebAPI.DTOs
{
    public class ReclamationDtoCreate
    {
        public Guid Id { get; set; }
      
        public string? Titre { get; set; }

        public string? Description { get; set; }

        public string? Statut { get; set; }
     
        public string? Priorite { get; set; }

        public string? Source { get; set; }

        public string? NumeroReference { get; set; }

        public int ClientId { get; set; }

        public string? NomClient { get; set; }

        public int ProduitId { get; set; }

        public string? DesignationProduit { get; set; }


        // Complaint Information
        [MaxLength(50)]
        public string? Lot { get; set; }

        public string? AnalyseReclamation { get; set; }

        public bool? Justifiee { get; set; }

        public string? CommentaireJustification { get; set; }

        public DateTime? DateExecution { get; set; }

        public DateTime? DateControleExecution { get; set; }

        public string? CommentaireControleExecution { get; set; }

        public DateTime? DateClotureReclamation { get; set; }

        [MaxLength(50)]
        public string? EtatReclamation { get; set; }

        public double? Degats { get; set; }

        [MaxLength(50)]
        public string? Rapport { get; set; }

        [MaxLength(50)]
        public string? ResponsableFaute { get; set; }

        // Dates
        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }


    }
}
