using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Entities.Crm
{
    [Table("StatutProspection", Schema = "Crm")]
    public class StatutProspection
    {
        public int Id { get; set; }

        public string? Libelle { get; set; }

        // Navigation Property
       // public ICollection<Prospection>? Prospections { get; set; }
    }
}
