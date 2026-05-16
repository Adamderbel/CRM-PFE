using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Worker.dtos
{
    public class DevisCermResult
    {
        public string? NumeroDevis { get; set; }

        public DateTime? DateDevis { get; set; }
        public string? ClientCermId { get; set; }
        public Guid UserId { get; set; }
    }
}
