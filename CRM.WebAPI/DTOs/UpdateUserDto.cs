using System.ComponentModel.DataAnnotations;

namespace CRM.WebAPI.DTOs
{
    public class UpdateUserDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string UserName { get; set; } = string.Empty;

        public string Nom { get; set; } = string.Empty;

        public string Prenom { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty;
    }
}
