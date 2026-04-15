using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.Entities.Comm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.FamilleProduits
{
    public class FamilleProduitService : IFamilleProduitService
    {
        private readonly IGenericRepository<FamilleProduit> _familleProduitRepository;
        private readonly DataContext _context;

        public FamilleProduitService(IGenericRepository<FamilleProduit> familleProduitRepository, DataContext context)
        {
            _familleProduitRepository = familleProduitRepository;
            _context = context;
        }
        public Task<IEnumerable<FamilleProduit>> GetAllAsync()
        {
            return _familleProduitRepository.GetAllAsync();
        }
        public Task<FamilleProduit?> GetByIdAsync(int id)
        {
            return _familleProduitRepository.GetByIdAsync(id);
        }
    }
}
