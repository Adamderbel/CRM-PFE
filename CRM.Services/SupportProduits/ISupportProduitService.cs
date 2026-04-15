using CRM.Entities.Comm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.SupportProduits
{
    public interface ISupportProduitService
    {
        Task<IEnumerable<SupportProduit>> GetAllAsync();
        Task<SupportProduit?> GetByIdAsync(int? id);
    }
}
