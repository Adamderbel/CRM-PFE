namespace CRM.WebAPI.DTOs
{
    public class LigneProspectionCreateDto
    {
        public string? Designation { get; set; }

       

        public int FamilleProduitId { get; set; }

        public int? SupportProduitId { get; set; }

        public Guid ProspectionId { get; set; }

        public int? SocieteeId { get; set; }

        public int? StatutId { get; set; }

        public DateTime Date { get; set; }


    }
}
