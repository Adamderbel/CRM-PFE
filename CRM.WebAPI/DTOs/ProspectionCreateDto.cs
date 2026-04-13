namespace CRM.WebAPI.DTOs
{
    public class ProspectionCreateDto
    {
        public DateTime? DateDebut { get; set; }
        public DateTime? DateFin { get; set; }

        public string? Notes { get; set; }

        // Foreign Keys
        public int StatutId { get; set; }
        public Guid? UserId { get; set; }
        public Guid? ProspectId { get; set; }
    }
}
