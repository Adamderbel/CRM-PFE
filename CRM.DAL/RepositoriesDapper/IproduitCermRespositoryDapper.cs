using CRM.Entities.Common;
using CRM.Entities.Crm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.DAL.RepositoriesDapper
{
    public interface IProduitCermRespositoryDapper
    {
        public Task<IEnumerable<ProduitCerm>> RechercherProduitCerm(String Recherche);
    }
}
