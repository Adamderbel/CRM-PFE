using CRM.Entities.Crm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.prospections
{
    public interface IProspectionServices
    {
        Task<IEnumerable<Prospection>> GetAllAsync(Guid? userId = null, string? role = null);
        Task<IEnumerable<Prospection>> GetByProspectIdAsync(Guid prospectId);
        Task<Prospection?> GetByIdAsync(Guid id);
        Task CreateAsync(Prospection prospection);
        Task DeleteAsync(Guid id);
        Task UpdateAsync(Prospection prospection);
    }
}
