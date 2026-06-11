using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.DAL.RepositoriesDapper;
using CRM.Entities.Crm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.prospections
{
    public class ProspectionService : IProspectionServices
    {
        private readonly IGenericRepository<Prospection> _prospectionRepository;
        private readonly DataContext _context;
        private readonly IProspectionRespositoryDapper _prospectionRepositoryDapper;


        public ProspectionService(
            IGenericRepository<Prospection> prospectionRepository,
            DataContext context,
            IProspectionRespositoryDapper prospectionRepositoryDapper)
        {
            _prospectionRepository = prospectionRepository;
            _context = context;
            _prospectionRepositoryDapper = prospectionRepositoryDapper;
        }
    
        public async Task<IEnumerable<Prospection>> GetAllAsync(Guid? userId = null, string? role = null)
        {
            if (IsCommercial(role) && userId.HasValue)
            {
                return await _prospectionRepository.FindAsync(p => p.UserId == userId.Value);
            }

            return await _prospectionRepository.GetAllAsync();

        }

        public async Task<IEnumerable<Prospection>> GetByProspectIdAsync(Guid prospectId)
        {
            var prospections = await _prospectionRepository.GetAllAsync();
            return prospections.Where(p => p.ProspectId == prospectId).ToList();
        }

        public async Task<Prospection?> GetByIdAsync(Guid id)
        {
            return await _prospectionRepository.GetByIdAsync(id);

        }
        public async Task CreateAsync(Prospection prospection)
        {
            if (prospection.Id == Guid.Empty)
            {
                prospection.Id = Guid.NewGuid();
            }

            await _prospectionRepository.InsertAsync(prospection);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(Guid id)
        {
            await _prospectionRepository.DeleteAsync(id);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(Prospection prospection)
        {
            await _prospectionRepository.UpdateAsync(prospection);
            await _context.SaveChangesAsync();
        }

        private static bool IsCommercial(string? role)
            => string.Equals(role, "COMMERCIAL", StringComparison.OrdinalIgnoreCase)
            || string.Equals(role, "Commercial", StringComparison.OrdinalIgnoreCase);
    } 
}

