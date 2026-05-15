using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Entities.Common
{
    public class CermCommande
    {
        public string RefCommande { get; set; }

        public string? ReferenceCommande { get; set; }

        public string? ClientId { get; set; }

        public string? SiteId { get; set; }

        public DateTime? DateCommande { get; set; }

        public DateTime? DateLivraisonPrevue { get; set; }

        public DateTime? DateLivraisonReelle { get; set; }

        public string? StatutCommande { get; set; }
    }
}