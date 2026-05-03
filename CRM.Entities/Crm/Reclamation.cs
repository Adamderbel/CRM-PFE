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
        public int? ResponsableId { get; set; }
        

        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties

        [ForeignKey("ClientId")]
        public  ClientCerm? Client { get; set; }

        [ForeignKey("ProduitRef")]
        public  ProduitCerm? Produit { get; set; }

        

        // If you have a User table later
        // [ForeignKey("ResponsableId")]
        // public virtual User? Responsable { get; set; }
    }
}