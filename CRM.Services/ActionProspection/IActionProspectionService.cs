using CRM.Entities.Crm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.ActionProspection
{
    public interface IActionProspectionService
    {
        Task<IEnumerable<ActionsProspection>> GetByProspectionIdAsync(Guid prospectionId);

        Task<IEnumerable<ActionsProspection>> GetByLigneProspectionIdAsync(Guid ligneId);

        Task<ActionsProspection?> GetByIdAsync(Guid id);

        Task<ActionsProspection?> GetLastActionAsync(Guid prospectionId);

        Task AddAsync(ActionsProspection action);

        Task UpdateAsync(ActionsProspection action);

        Task DeleteAsync(Guid id);
    }
}
