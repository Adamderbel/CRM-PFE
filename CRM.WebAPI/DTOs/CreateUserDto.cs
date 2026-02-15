namespace CRM.WebAPI.DTOs
{
    public class CreateUserDto
    {
        public required string Email { get; set; }
        public required string UserName { get; set; }
        public string Nom { get; set; } = null!;
        public string Prenom { get; set; } = null!;
        public required string Password { get; set; }
        public String Role { get; set; } = null!;
    }
}
