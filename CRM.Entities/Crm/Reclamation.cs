using CRM.Entities.Common;
using CRM.Entities.Crm;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRM.Entities
{
    [Table("Reclamation", Schema = "crm")]
    public class Reclamation
    {
        [Key]
        public Guid Id { get; set; }

        [MaxLength(200)]
        public string? Titre { get; set; }

        public string? Description { get; set; }

        [MaxLength(50)]
        public string? Statut { get; set; }

        [MaxLength(50)]
        public string? Priorite { get; set; }

        [MaxLength(50)]
        public string? Source { get; set; }

        [MaxLength(100)]
        public string? NumeroReference { get; set; }

        // Foreign Keys
        public int ClientId { get; set; }

        public int ProduitRef { get; set; }

        // Dates
        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public DateTime? DateExecution { get; set; }

        public DateTime? DateControleExecution { get; set; }

        public DateTime? DateClotureReclamation { get; set; }

        // Complaint Information
        [MaxLength(50)]
        public string? Lot { get; set; }

        public string? AnalyseReclamation { get; set; }

        public bool? Justifiee { get; set; }

        public string? CommentaireJustification { get; set; }

        public string? CommentaireControleExecution { get; set; }

        [MaxLength(50)]
        public string? EtatReclamation { get; set; }

        public double? Degats { get; set; }

        [MaxLength(50)]
        public string? Rapport { get; set; }

        [Column("Responsable Faute")]
        [MaxLength(50)]
        public string? ResponsableFaute { get; set; }

        // Navigation Properties

        [ForeignKey(nameof(ClientId))]
        public virtual ClientCerm? Client { get; set; }

        [ForeignKey(nameof(ProduitRef))]
        public virtual ProduitCerm? Produit { get; set; }
    }
}