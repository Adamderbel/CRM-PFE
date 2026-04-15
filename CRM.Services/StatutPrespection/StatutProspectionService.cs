using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.DAL.RepositoriesDapper;
using CRM.Entities.Crm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.StatutPrespection
{
    public class StatutProspectionService : IstatutProspectionService
    {
        private readonly IGenericRepository<StatutProspection> _statutProspectionRepository;
        private readonly DataContext _context;
        private readonly IStatutProspectionRepositoryDapper _statutProspectionRepositoryDapper;
    
    public StatutProspectionService(
        IGenericRepository<StatutProspection> statutProspectionRepository,
        DataContext context,
        IStatutProspectionRepositoryDapper statutProspectionRepositoryDapper)
        {
            _statutProspectionRepository = statutProspectionRepository;
            _context = context;
            _statutProspectionRepositoryDapper = statutProspectionRepositoryDapper;
        } 
        public async Task<IEnumerable<Entities.Crm.StatutProspection>> GetAllAsync()
        {
            return await _statutProspectionRepository.GetAllAsync();
        }
        public async Task<Entities.Crm.StatutProspection?> GetByIdAsync(int? id)
        {
            return await _statutProspectionRepository.GetByIdAsync(id);
        }
    }
}