using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Entities.Common
{
    [Table("DomaineActivites", Schema = "comm")]
    public class DomaineActivites
    {
        public int Id { get; set; }

        public string? Activitee { get; set; }
    }
}
