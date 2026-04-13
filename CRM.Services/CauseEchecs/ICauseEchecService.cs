using CRM.Entities.Comm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.CauseEchecs
{
    public interface ICauseEchecService
    {
        Task<IEnumerable<CauseEchec>> GetAllAsync();
        Task<CauseEchec?> GetByIdAsync(int id);
    }
}
