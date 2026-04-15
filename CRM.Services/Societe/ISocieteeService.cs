using CRM.Entities.Comm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.Societe
{
    public interface ISocieteeService
    {
        Task<IEnumerable<Societee>> GetAllAsync();
        Task<Societee?> GetByIdAsync(int? id);
    }
}
