using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Entities.Common
{
    public class ProduitCerm
    {
        public int RefProduit { get; set; }

        public string? Designation { get; set; }
        public DateTime? LastModifiedDate { get; set; }

        public DateTime? LastSyncDate { get; set; }
    
    }
}
