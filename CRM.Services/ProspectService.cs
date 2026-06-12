using CRM.Core.Exceptions;
using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.DAL.RepositoriesDupper;
using CRM.Entities.Crm;
using CRM.Services.comm;
using Microsoft.EntityFrameworkCore;
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
        private readonly CodeGeneratorService _codeGeneratorService; 


        public ProspectService(
            IGenericRepository<Prospect> prospectRepository,
            IProspectRepositoryDapper prospectRepositoryDapper,
            DataContext context,
            CodeGeneratorService codeGenerator)
        {
            _prospectRepository = prospectRepository;
            _prospectRepositoryDapper =  prospectRepositoryDapper;
            _context = context;
             _codeGeneratorService = codeGenerator;
        }

        public async Task<IEnumerable<Prospect>> GetAllAsync(Guid? userId = null, string? role = null)
        {
            if (IsCommercial(role) && userId.HasValue)
            {
                return await _prospectRepository.FindAsync(p => p.UserId == userId.Value);
            }

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
            prospect.CodeCRM = await GenerateNextClientCodeAsync();

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
            await using var transaction = await _context.Database.BeginTransactionAsync();

            var prospectionIds = await _context.Prospections
                .Where(prospection => prospection.ProspectId == id)
                .Select(prospection => prospection.Id)
                .ToListAsync();

            if (prospectionIds.Count > 0)
            {
                var actions = await _context.ActionsProspections
                    .Where(action => prospectionIds.Contains(action.ProspectionId))
                    .ToListAsync();
                _context.ActionsProspections.RemoveRange(actions);

                var lignes = await _context.LigneProspections
                    .Where(ligne => prospectionIds.Contains(ligne.ProspectionId))
                    .ToListAsync();
                _context.LigneProspections.RemoveRange(lignes);

                var prospections = await _context.Prospections
                    .Where(prospection => prospectionIds.Contains(prospection.Id))
                    .ToListAsync();
                _context.Prospections.RemoveRange(prospections);
            }

            await _prospectRepository.DeleteAsync(id);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        public async Task<IEnumerable<Prospect>> GetAllAsyncDapper(Guid? userId = null, string? role = null)
        {
            if (IsCommercial(role) && userId.HasValue)
            {
                return (await _prospectRepository.GetAllAsync()).Where(p => p.UserId == userId.Value).ToList();
            }

            return await _prospectRepositoryDapper.GetAllProspect();
        }

        private static bool IsCommercial(string? role)
            => string.Equals(role, "COMMERCIAL", StringComparison.OrdinalIgnoreCase)
            || string.Equals(role, "Commercial", StringComparison.OrdinalIgnoreCase);

        private async Task<string> GenerateNextClientCodeAsync()
        {
            const string prefix = "CLI-";
            var codes = await _context.Prospects
                .Where(p => p.CodeCRM != null && p.CodeCRM.StartsWith(prefix))
                .Select(p => p.CodeCRM!)
                .ToListAsync();

            var maxNumber = codes
                .Select(code => code[prefix.Length..])
                .Where(value => int.TryParse(value, out _))
                .Select(int.Parse)
                .DefaultIfEmpty(0)
                .Max();

            return $"{prefix}{maxNumber + 1:000000}";
        }
    }
}
