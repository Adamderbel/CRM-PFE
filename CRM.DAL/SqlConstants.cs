using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.DAL
{
    public static class Schema
    {
        public const string comm = nameof(comm);
        public const string crm = nameof(crm);
        public const string sec = nameof(sec);
    }

    public static class SP
    {
        // Prospect 
        public const string GetAllProspect = $"{Schema.crm}.{nameof(GetAllProspect)}";

        //Produit
        public const string sp_RechercherProduitCerm = $"{Schema.comm}.{nameof(sp_RechercherProduitCerm)}";
    }
}
