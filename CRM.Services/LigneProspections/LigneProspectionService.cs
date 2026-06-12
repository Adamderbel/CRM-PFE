using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.DAL.RepositoriesDapper;
using CRM.Entities.Crm;
using Microsoft.EntityFrameworkCore;
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
           // ValidateBusinessRules(ligneProspection);
            ligneProspection.CodeCRM = await GenerateNextProductCodeAsync();
            ligneProspection.RefArt = null;
            await _ligneProspectionRepository.InsertAsync(ligneProspection);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            await _ligneProspectionRepository.DeleteAsync(id);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<LigneProspection>> GetAllAsync(Guid? userId = null, string? role = null)
        {
            var query = _context.Set<LigneProspection>()
                .AsNoTracking()
                .Include(l => l.Statut)
                .Include(l => l.FamilleProduit)
                .Include(l => l.SupportProduit)
                .Include(l => l.Societee)
                .Include(l => l.Prospection)
                    .ThenInclude(p => p!.Prospect)
                .AsQueryable();

            if (IsCommercial(role) && userId.HasValue)
            {
                query = query.Where(l => l.Prospection != null && l.Prospection.UserId == userId.Value);
            }

            return await query.ToListAsync();
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
                ligne.StatutId = 5;
            }
            // 🔴 LOSS
            else
            {
                if (causeEchecId == null)
                    throw new Exception("Cause d'échec obligatoire");

                ligne.Concretisee = false;
                ligne.CauseEchecId = causeEchecId;
                ligne.StatutId = 6;
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

        private static bool IsCommercial(string? role)
            => string.Equals(role, "COMMERCIAL", StringComparison.OrdinalIgnoreCase)
            || string.Equals(role, "Commercial", StringComparison.OrdinalIgnoreCase);

        private async Task<string> GenerateNextProductCodeAsync()
        {
            const string prefix = "PRD-";
            var existingCodes = await _context.Set<LigneProspection>()
                .AsNoTracking()
                .Where(l => l.CodeCRM != null && l.CodeCRM.StartsWith(prefix))
                .Select(l => l.CodeCRM!)
                .ToListAsync();

            var maxNumber = existingCodes
                .Select(code => int.TryParse(code[prefix.Length..], out var number) ? number : 0)
                .DefaultIfEmpty(0)
                .Max();

            return $"{prefix}{maxNumber + 1:D6}";
        }
    }
}
