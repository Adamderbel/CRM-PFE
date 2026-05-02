using CRM.Core.Exceptions;
using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.DAL.RepositoriesDupper;
using CRM.Entities.Crm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services
{
    public class ProspectService : IProspectService
    {
        private readonly IGenericRepository<Prospect> _prospectRepository;
        private readonly IProspectRepositoryDapper _prospectRepositoryDapper;
        private readonly DataContext _context;
        

        public ProspectService(
            IGenericRepository<Prospect> prospectRepository,
            IProspectRepositoryDapper prospectRepositoryDapper,
            DataContext context)
        {
            _prospectRepository = prospectRepository;
            _prospectRepositoryDapper =  prospectRepositoryDapper;
            _context = context;
        }

        public async Task<IEnumerable<Prospect>> GetAllAsync()
        {
            return await _prospectRepository.GetAllAsync();
        }

        public async Task<Prospect?> GetByIdAsync(Guid id)
        {
            var prospect = await _prospectRepository.GetByIdAsync(id);
            if (prospect == null)
            {
                throw new BusinessException("Prospect introuvable", 404);
            }

                return prospect;
        }

        public async Task CreateAsync(Prospect prospect)
        {
            prospect.DateCreation ??= DateTime.Now;

            await _prospectRepository.InsertAsync(prospect);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Prospect prospect)
        {
            await _prospectRepository.UpdateAsync(prospect);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            await _prospectRepository.DeleteAsync(id);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<Prospect>> GetAllAsyncDapper()
        {
            return await _prospectRepositoryDapper.GetAllProspect();
        }
    }
}