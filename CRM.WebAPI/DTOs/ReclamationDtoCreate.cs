using System.ComponentModel.DataAnnotations;

namespace CRM.WebAPI.DTOs
{
    public class ReclamationDtoCreate
    {
        public Guid Id { get; set; }
      
        public string? Titre { get; set; }

        public string? Description { get; set; }

        public string? Statut { get; set; }
     
        public string? Priorite { get; set; }

        public string? Source { get; set; }

        public string? NumeroReference { get; set; }

        public int ClientId { get; set; }

        public string? NomClient { get; set; }

        public int ProduitId { get; set; }

        public string? DesignationProduit { get; set; }

        public int? ResponsableId { get; set; }
    }
}
