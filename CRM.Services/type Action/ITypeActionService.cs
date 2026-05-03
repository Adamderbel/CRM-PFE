using CRM.Entities.Comm;
using CRM.Entities.Crm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.type_Action
{
    public interface ITypeActionService
    {
        Task<IEnumerable<TypeActionProspection>> GetAllAsync();
        Task<TypeActionProspection?> GetByIdAsync(int id);
    }
}
