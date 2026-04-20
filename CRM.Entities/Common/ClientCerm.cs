using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Entities.Common
{
    public class ClientCerm
    {
        public int RefClient { get; set; }

        public string? Nom { get; set; }
        public DateTime? LastModifiedDate { get; set; }
        public DateTime? LastSyncDate { get; set; }
    }
}
