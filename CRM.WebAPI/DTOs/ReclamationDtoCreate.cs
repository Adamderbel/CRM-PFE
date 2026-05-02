using System.ComponentModel.DataAnnotations;

namespace CRM.WebAPI.DTOs
{
    public class ReclamationDtoCreate
    {
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

        public int ClientId { get; set; }

        public int ProduitId { get; set; }

        public int? ResponsableId { get; set; }
    }
}
