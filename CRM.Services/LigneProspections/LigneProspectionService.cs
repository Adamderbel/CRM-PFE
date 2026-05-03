using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.DAL.RepositoriesDapper;
using CRM.Entities.Crm;
using CRM.Services.comm;
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
        private readonly CodeGeneratorService _codeGeneratorService;
        public LigneProspectionService(IGenericRepository<LigneProspection> ligneProspectionRepository, DataContext context, ILigneProspectionRespositoryDapper LigneProspectionRespositoryDapper,CodeGeneratorService codeGeneratorService)
        {
            _ligneProspectionRepository = ligneProspectionRepository;
            _context = context;
            _ligneProspectionRepositoryDapper = LigneProspectionRespositoryDapper;
            _codeGeneratorService = codeGeneratorService;
        }

        public async Task CreateAsync(LigneProspection ligneProspection)
        {
           // ValidateBusinessRules(ligneProspection);
            ligneProspection.CodeCRM = _codeGeneratorService.GenerateCode("PROD");
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
           // ValidateBusinessRules(ligneProspection);
            await _ligneProspectionRepository.UpdateAsync(ligneProspection);
            await _context.SaveChangesAsync();
        }
       
        public async Task CloseAsync(Guid id, int? causeEchecId)
        {
            var ligne = await _ligneProspectionRepository.GetByIdAsync(id);

            if (ligne == null)
                throw new Exception("Ligne introuvable");

            // 🟢 WIN
            if (!string.IsNullOrEmpty(ligne.NumeroCommande))
            {
                ligne.Concretisee = true;
                ligne.CauseEchecId = null;
            }
            // 🔴 LOSS
            else
            {
                if (causeEchecId == null)
                    throw new Exception("Cause d'échec obligatoire");

                ligne.Concretisee = false;
                ligne.CauseEchecId = causeEchecId;
            }

            await _ligneProspectionRepository.UpdateAsync(ligne);
            await _context.SaveChangesAsync();
        }


        private void ValidateBusinessRules(LigneProspection ligne)
        {
            // Gagné + cause d’échec = incohérent
            if (ligne.Concretisee == true && ligne.CauseEchecId != null)
                throw new Exception("Une ligne gagnée ne peut pas avoir une cause d'échec");

            // Perdu sans cause
            if (ligne.Concretisee == false && ligne.CauseEchecId == null)
                throw new Exception("Une ligne perdue doit avoir une cause d'échec");
        }
    }
}
