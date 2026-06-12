using CRM.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.reclamations
{
    public interface IReclamationService
    {
        Task<IEnumerable<Reclamation>> GetAllReclamations(Guid? userId = null, string? role = null);
         Task<Reclamation> GetReclamationById(Guid id);
         Task AddReclamation(Reclamation reclamation);
         Task UpdateReclamation(Guid id, Reclamation reclamation);
         Task DeleteReclamation(Guid id);
         Task<string> GetNextReferenceAsync();
    }
}
