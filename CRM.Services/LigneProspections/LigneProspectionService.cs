using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.DAL.RepositoriesDapper;
using CRM.Entities.Crm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.LigneProspections
{
    public class LigneProspectionService : ILigneProspectionService
    {
        private readonly IGenericRepository<LigneProspection> _ligneProspectionRepository;
        private readonly DataContext _context;
        private readonly ILigneProspectionRespositoryDapper _ligneProspectionRepositoryDapper;
        public LigneProspectionService(IGenericRepository<LigneProspection> ligneProspectionRepository, DataContext context, ILigneProspectionRespositoryDapper LigneProspectionRespositoryDapper)
        {
            _ligneProspectionRepository = ligneProspectionRepository;
            _context = context;
            _ligneProspectionRepositoryDapper = LigneProspectionRespositoryDapper;
        }

        public async Task CreateAsync(LigneProspection ligneProspection)
        {
            await _ligneProspectionRepository.InsertAsync(ligneProspection);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            await _ligneProspectionRepository.DeleteAsync(id);
            await _context.SaveChangesAsync();
        }

        public Task<IEnumerable<LigneProspection>> GetAllAsync()
        {
           return _ligneProspectionRepository.GetAllAsync();
        }

        public async Task<LigneProspection?> GetByIdAsync(Guid id)
        {
            return  await _ligneProspectionRepository.GetByIdAsync(id);
        }

        public async Task UpdateAsync(LigneProspection ligneProspection)
        {
            await _ligneProspectionRepository.UpdateAsync(ligneProspection);
            await _context.SaveChangesAsync();
        }
    }
}
