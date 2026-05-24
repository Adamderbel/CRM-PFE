using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Entities.Crm
{
    [Table("ActionsProspection", Schema = "crm")]
    public class ActionsProspection
    {
        public Guid Id { get; set; }

        public Guid ProspectionId { get; set; }

        public Guid? LigneProspectionId { get; set; }

        public int TypeActionId { get; set; }

        public DateTime DateAction { get; set; }

        public string? Commentaire { get; set; }

        public string? Resultat { get; set; }

        // Navigation properties
        public Prospection? Prospection { get; set; }

        public LigneProspection? LigneProspection { get; set; }

        public TypeActionProspection? TypeAction { get; set; }
    }
}
