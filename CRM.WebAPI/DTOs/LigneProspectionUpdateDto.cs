namespace CRM.WebAPI.DTOs
{
    public class LigneProspectionUpdateDto
    {
        public string? Designation { get; set; }



        public int FamilleProduitId { get; set; }

        public int? SupportProduitId { get; set; }

        public Guid ProspectionId { get; set; }

        public int? SocieteId { get; set; }

        public int? StatutId { get; set; }

        public DateTime Date { get; set; }

        public DateTime? DateDemandeOffre { get; set; }

        public string? NumeroDevis { get; set; }

        public DateTime? DateDevis { get; set; }

        public string? NumeroCommande { get; set; }

        public DateTime? DateCommande { get; set; }

        public bool BatEnvoyee { get; set; }

        public DateTime? DateEnvoiBat { get; set; }

        public bool Concretisee { get; set; }

        public int? CauseEchecId { get; set; }
    }
}
