namespace CRM.WebAPI.DTOs
{
    public class UpdateProspectDTO
    {
        public int Id { get; set; }
        public string? Nom { get; set; }

        public string? Prenom { get; set; }

        public string? Email { get; set; }

        public string? Telephone { get; set; }

        public string? Source { get; set; }

        public DateTime? DateCreation { get; set; }

        public string? Notes { get; set; }

        public int idDomaineActivitee { get; set; }
    }
}
