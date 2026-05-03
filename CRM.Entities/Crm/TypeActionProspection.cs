using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Entities.Crm
{
    [Table("TypeActionProspection", Schema = "crm")]
    public class TypeActionProspection
    {
            public int Id { get; set; }

            public string Libelle { get; set; } = string.Empty;

    }
}
