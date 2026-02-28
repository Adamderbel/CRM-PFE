using CRM.Entities.Common;
using CRM.Entities.Crm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services
{
    public interface IDomaineActiviteService
    {
        Task<IEnumerable<DomaineActivites>> GetAllAsync();
        Task<DomaineActivites?> GetByIdAsync(int id);
    }
}
