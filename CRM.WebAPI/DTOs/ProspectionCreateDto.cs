using System.ComponentModel.DataAnnotations;

namespace CRM.WebAPI.DTOs
{
    public class ProspectionCreateDto
    {
        [Required(ErrorMessage = "La date de début est obligatoire.")]
        public DateTime? DateDebut { get; set; }
        
        public DateTime? DateFin { get; set; }

        [StringLength(500, ErrorMessage = "Les notes ne peuvent pas dépasser 500 caractères.")]
        public string? Notes { get; set; }

        // Foreign Keys
        [Required(ErrorMessage = "Le statut est obligatoire.")]
        public int StatutId { get; set; }
        [Required(ErrorMessage = "L'utilisateur (commercial) est obligatoire.")]
        public Guid? UserId { get; set; }
        [Required(ErrorMessage = "Le prospect est obligatoire.")]
        public Guid? ProspectId { get; set; }
    }
}
