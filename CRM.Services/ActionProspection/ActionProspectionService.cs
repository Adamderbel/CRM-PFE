using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.Entities.Crm;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.ActionProspection
{
    public class ActionProspectionService : IActionProspectionService
    {
        private readonly IGenericRepository<ActionsProspection> _repo;
        private readonly DataContext _context;

        public ActionProspectionService(
            IGenericRepository<ActionsProspection> repo,
            DataContext context)
        {
            _repo = repo;
            _context = context;
        }

        public async Task<IEnumerable<ActionsProspection>> GetByProspectionIdAsync(Guid prospectionId)
        {
            return await _context.Set<ActionsProspection>()
                .Where(a => a.ProspectionId == prospectionId)
                .Include(a => a.TypeAction)
                .ToListAsync();
        }

        public async Task<IEnumerable<ActionsProspection>> GetByLigneProspectionIdAsync(Guid ligneId)
        {
            return await _context.Set<ActionsProspection>()
                .Where(a => a.LigneProspectionId == ligneId)
                .Include(a => a.TypeAction)
                .ToListAsync();
        }

        public async Task<ActionsProspection?> GetByIdAsync(Guid id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<ActionsProspection?> GetLastActionAsync(Guid prospectionId)
        {
            return await _context.Set<ActionsProspection>()
                .Where(a => a.ProspectionId == prospectionId)
                .OrderByDescending(a => a.DateAction)
                .FirstOrDefaultAsync();
        }

        public async Task AddAsync(ActionsProspection action)
        {
            action.Id = Guid.NewGuid();
            action.DateAction = action.DateAction == default
                ? DateTime.Now
                : action.DateAction;

            await ValidateAsync(action);

            await _repo.InsertAsync(action);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ActionsProspection action)
        {
            await ValidateAsync(action);

            await _repo.UpdateAsync(action);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repo.DeleteAsync(id);
            await _context.SaveChangesAsync();
        }

        private async Task ValidateAsync(ActionsProspection action)
        {
            if (action.ProspectionId == Guid.Empty)
                throw new Exception("ProspectionId obligatoire");

            if (action.TypeActionId <= 0)
                throw new Exception("TypeActionId obligatoire");

            var typeExists = await _context.TypeActionProspections
                .AnyAsync(t => t.Id == action.TypeActionId);
            if (!typeExists)
                throw new Exception("Type d'action introuvable");

            if (action.LigneProspectionId != null)
            {
                var ligne = await _context.LigneProspections
                    .FirstOrDefaultAsync(l => l.Id == action.LigneProspectionId);

                if (ligne == null)
                    throw new Exception("LigneProspection introuvable");

                if (ligne.ProspectionId != action.ProspectionId)
                    throw new Exception("Incohérence Prospection / LigneProspection");
            }
        }
    }
}