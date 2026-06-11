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
        Task<IEnumerable<Prospect>> GetAllAsync(Guid? userId = null, string? role = null);
        Task<Prospect?> GetByIdAsync(Guid id);
        Task CreateAsync(Prospect prospect);
        Task UpdateAsync(Prospect prospect);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<Prospect>> GetAllAsyncDapper(Guid? userId = null, string? role = null);
    }
}
