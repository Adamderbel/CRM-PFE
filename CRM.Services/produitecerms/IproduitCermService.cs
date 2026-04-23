using CRM.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.produitecerms
{
    public interface IproduitCermService
    {
        Task<IEnumerable<ProduitCerm>> GetAllAsync();
        Task<ProduitCerm?> GetByIdAsync(int id);
        public Task<IEnumerable<ProduitCerm>> RechercherProduitCerm(String Recherche);
    }
}
