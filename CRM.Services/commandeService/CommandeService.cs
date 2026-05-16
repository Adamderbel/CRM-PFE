using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.Entities.Common;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.commandeService
{
    public class CommandeService : ICommandeService
    {
        private readonly IGenericRepository<CermCommande> _commandeCermRepository;
        private readonly IGenericRepository<CermCommandeLigne> _ligneCommandeCermRepository;
        private readonly DataContext _context;

        public CommandeService(
            IGenericRepository<CermCommande> commandeCermRepository,
            IGenericRepository<CermCommandeLigne> ligneCommandeCermRepository,
            DataContext context)
        {
            _commandeCermRepository = commandeCermRepository;
            _ligneCommandeCermRepository = ligneCommandeCermRepository;
            _context = context;
        }

        public async Task<CermCommande?> GetCommandeAsync(string refCommande)
        {
            if (string.IsNullOrWhiteSpace(refCommande))
                return null;

            return await _context.Set<CermCommande>()
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.RefCommande == refCommande);
        }

        public async Task<List<CermCommande>> GetCommandesByClientAsync(string clientId)
        {
            if (string.IsNullOrWhiteSpace(clientId))
                return new List<CermCommande>();

            return await _context.Set<CermCommande>()
                .AsNoTracking()
                .Where(x => x.ClientId == clientId)
                .OrderByDescending(x => x.DateCommande)
                .ToListAsync();
        }

        public async Task<List<CermCommandeLigne>> GetLignesCommandeByRefAsync(string refCommande)
        {
            if (string.IsNullOrWhiteSpace(refCommande))
                return new List<CermCommandeLigne>();

            return await _context.Set<CermCommandeLigne>()
                .AsNoTracking()
                .Where(x => x.RefCommande == refCommande)
                .OrderBy(x => x.LigneId)
                .ToListAsync();
        }
    }
}