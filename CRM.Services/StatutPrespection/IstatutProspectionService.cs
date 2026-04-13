using CRM.Entities.Common;
using CRM.Entities.Crm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.StatutPrespection
{
    public interface IstatutProspectionService
    {
        Task<IEnumerable<StatutProspection>> GetAllAsync();
        Task<StatutProspection?> GetByIdAsync(int? id);
    }
}
