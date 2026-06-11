using CRM.Entities.Common;
using CRM.Entities.Security;
using System;
using System.ComponentModel.DataAnnotations.Schema;

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

        public string? ClientCermId { get; set; }

        public Guid? UserId { get; set; }

        [ForeignKey("UserId")]
        public SecUser? User { get; set; }
    }
}
