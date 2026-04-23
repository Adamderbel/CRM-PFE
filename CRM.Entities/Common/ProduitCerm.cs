using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Entities.Common
{
    [Table("ProduitCerm", Schema = "comm")]
    public class ProduitCerm
    {
        [Key]
        public int RefProduit { get; set; }

        public string? Designation { get; set; }
        public DateTime? LastModifiedDate { get; set; }

        public DateTime? LastSyncDate { get; set; }
    
    }
}
