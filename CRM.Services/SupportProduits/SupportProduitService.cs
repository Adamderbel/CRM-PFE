using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.Entities.Comm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.SupportProduits
{
    public class SupportProduitService : ISupportProduitService
    {
        private readonly IGenericRepository<SupportProduit> _supportProduitRepository;
        private readonly DataContext _context;
        public  SupportProduitService(IGenericRepository<SupportProduit> supportProduitRepository, DataContext context)
        {
            _supportProduitRepository = supportProduitRepository;
            _context = context;
        }
        public Task<IEnumerable<SupportProduit>> GetAllAsync()
        {
            return _supportProduitRepository.GetAllAsync();
        }
        public Task<SupportProduit?> GetByIdAsync(int? id)
        {
            return _supportProduitRepository.GetByIdAsync(id);
        }
    }
}
