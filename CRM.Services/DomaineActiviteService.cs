using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.DAL.RepositoriesDapper;
using CRM.DAL.RepositoriesDupper;
using CRM.Entities.Common;
using CRM.Entities.Crm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services
{
    public class DomaineActiviteService : IDomaineActiviteService
    {
        private readonly IGenericRepository<DomaineActivites> _domaineRepository;
        private readonly IDomaineRespositoryDapper _domaineRepositoryDapper;
        private readonly DataContext _context;

        
        public DomaineActiviteService(
            IGenericRepository<DomaineActivites> domaineRepository,
            IDomaineRespositoryDapper domaineRepositoryDapper,
            DataContext context)
        {
            _domaineRepository = domaineRepository;
            _domaineRepositoryDapper = domaineRepositoryDapper;
            _context = context;
        }
        public async Task<IEnumerable<DomaineActivites>> GetAllAsync()
        {
            return await _domaineRepository.GetAllAsync();
        }
        public  async Task<DomaineActivites?> GetByIdAsync(int id)
        {
            return await _domaineRepository.GetByIdAsync(id);
        }
         
    }

}