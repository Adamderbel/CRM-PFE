using CRM.Entities.Security;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Entities.Crm
{
    [Table("Prospection", Schema = "Crm")]
    public class Prospection
    {
        public Guid Id { get; set; }

        public DateTime? DateDebut { get; set; }
        public DateTime? DateFin { get; set; }

        public string? Notes { get; set; }

        // Foreign Keys
        public int? StatutId { get; set; }
        public Guid? UserId { get; set; }
        public Guid? ProspectId { get; set; }
        public int? ClientId { get; set; }

        // Navigation Properties
        public StatutProspection? Statut { get; set; }
        public SecUser? User { get; set; }
        public Prospect? Prospect { get; set; }
        public CRM.Entities.Common.ClientCerm? Client { get; set; }
    }
}
