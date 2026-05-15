using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Entities.Common
{
    public class CermCommandeLigne
    {
        public string RefCommande { get; set; }
        public string LigneId { get; set; }

        public string ProduitId { get; set; }
        public string ClientId { get; set; }

        public double? QteCommandee { get; set; }
        public double? QteExpediee { get; set; }

        public string StatutLigne { get; set; }

        public DateTime? DateCommande { get; set; }
        public DateTime? DateLivraisonPrevue { get; set; }
        public DateTime? DateLivraisonReelle { get; set; }
    }
}
