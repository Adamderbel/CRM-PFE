using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.DAL.RepositoriesDapper;
using CRM.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.reclamations
{
    public class ReclamationService : IReclamationService
    {
        private readonly IReclamationRespositoryDapper _reclamationRepositoryDapper;
        private readonly DataContext _context;
        private readonly IGenericRepository<Reclamation> _reclamationRepository;

        public ReclamationService(IReclamationRespositoryDapper reclamationRepositoryDapper, DataContext context, IGenericRepository<Reclamation> reclamationRepository)
        {
            _reclamationRepositoryDapper = reclamationRepositoryDapper;
            _context = context;
            _reclamationRepository = reclamationRepository;
        }

        public async Task AddReclamation(Reclamation reclamation)
        {
            await _reclamationRepository.InsertAsync(reclamation);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteReclamation(Guid id)
        {
             var reclamation = await _reclamationRepository.GetByIdAsync(id);
            if (reclamation != null)
            {
               await _reclamationRepository.DeleteAsync(id);
               await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Reclamation>> GetAllReclamations(Guid? userId = null, string? role = null)
        {
            if (IsCommercial(role) && userId.HasValue)
            {
                return await _reclamationRepository.FindAsync(r => r.CommercialId == userId.Value);
            }

            return await _reclamationRepository.GetAllAsync();
        }

        public async Task<Reclamation> GetReclamationById(Guid id)
        {
            return await _reclamationRepository.GetByIdAsync(id);
        }

        public async Task UpdateReclamation(Guid id, Reclamation reclamation)
        {
            reclamation.Id = id; // Ensure ID matches if needed, though usually handled by repo
            await _reclamationRepository.UpdateAsync(reclamation);
            await _context.SaveChangesAsync();
        }

        private static bool IsCommercial(string? role)
            => string.Equals(role, "COMMERCIAL", StringComparison.OrdinalIgnoreCase)
            || string.Equals(role, "Commercial", StringComparison.OrdinalIgnoreCase);
    }
}
