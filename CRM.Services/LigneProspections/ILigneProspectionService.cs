using CRM.Entities.Crm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.LigneProspections
{
    public interface ILigneProspectionService
    {
        Task<IEnumerable<LigneProspection>> GetAllAsync();
        Task<LigneProspection?> GetByIdAsync(Guid id);
        Task CreateAsync(LigneProspection ligneProspection);
        Task UpdateAsync(LigneProspection ligneProspection);
        Task DeleteAsync(Guid id);

        // Métier CRM
        // 🎯 CRM
        Task CloseAsync(Guid id, int? causeEchecId);
    }
}
