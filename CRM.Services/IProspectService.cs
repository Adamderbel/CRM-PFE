using CRM.Entities.Crm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services
{
    public interface IProspectService
    {
        Task<IEnumerable<Prospect>> GetAllAsync();
        Task<Prospect?> GetByIdAsync(int id);
        Task CreateAsync(Prospect prospect);
        Task UpdateAsync(Prospect prospect);
        Task DeleteAsync(int id);
        Task<IEnumerable<Prospect>> GetAllAsyncDapper();
    }
}
