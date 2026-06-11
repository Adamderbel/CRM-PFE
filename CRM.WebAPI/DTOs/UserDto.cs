namespace CRM.WebAPI.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public IEnumerable<string> Roles { get; set; } = Array.Empty<string>();
    }
}
