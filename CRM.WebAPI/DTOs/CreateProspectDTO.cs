using CRM.Entities.Common;
using System.ComponentModel.DataAnnotations;

namespace CRM.WebAPI.DTOs
{
    public class CreateProspectDTO
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Le nom est obligatoire.")]
        [StringLength(100, ErrorMessage = "Le nom ne peut pas dépasser 100 caractères.")]
        public string? Nom { get; set; }

        [Required(ErrorMessage = "Le prénom est obligatoire.")]
        [StringLength(100, ErrorMessage = "Le prénom ne peut pas dépasser 100 caractères.")]
        public string? Prenom { get; set; }

        [Required(ErrorMessage = "L'email est obligatoire.")]
        [EmailAddress(ErrorMessage = "Format d'email invalide.")]
        [StringLength(150, ErrorMessage = "L'email ne peut pas dépasser 150 caractères.")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Le téléphone est obligatoire.")]
        [Phone(ErrorMessage = "Format de téléphone invalide.")]
        [StringLength(20, ErrorMessage = "Le téléphone ne peut pas dépasser 20 caractères.")]
        public string? Telephone { get; set; }

        public string? Source { get; set; }

        public DateTime? DateCreation { get; set; }

        [StringLength(500, ErrorMessage = "Les notes ne peuvent pas dépasser 500 caractères.")]
        public string? Notes { get; set; }

        [Required(ErrorMessage = "Le domaine d'activité est obligatoire.")]
        public int idDomaineActivitee { get; set; }
    }
}
