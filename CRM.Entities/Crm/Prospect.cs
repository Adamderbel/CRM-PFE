using CRM.Entities.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Entities.Crm
{
    [Table("Prospect", Schema = "crm")]
    public class Prospect
    {
        public Guid Id { get; set; }

        public string? Nom { get; set; }

        public string? Prenom { get; set; }

        public string? Email { get; set; }

        public string? Telephone { get; set; }

        public string? Source { get; set; }

        public DateTime? DateCreation { get; set; }

        public string? Notes { get; set; }

        public int idDomaineActivitee { get; set; }

        [ForeignKey("idDomaineActivitee")]
        public DomaineActivites? DomaineActivite { get; set; }
        public string? CodeCRM { get; set; }



    }
}
