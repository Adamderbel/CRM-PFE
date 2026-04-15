using CRM.Entities.Comm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.FamilleProduits
{
    public interface IFamilleProduitService
    {
        Task<IEnumerable<FamilleProduit>> GetAllAsync();
        Task<FamilleProduit?> GetByIdAsync(int id);
    }
}
