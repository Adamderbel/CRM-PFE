using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.DAL.RepositoriesDapper;
using CRM.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.produitecerms
{
    public class ProduitCermService : IproduitCermService
    {
        private readonly IGenericRepository<ProduitCerm> _produitCermRepository;
        private readonly DataContext _context;
        private readonly IProduitCermRespositoryDapper _produitCermRepositoryDapper;

        public ProduitCermService(IGenericRepository<ProduitCerm> produitCermRepository, DataContext context, IProduitCermRespositoryDapper produitCermRespositoryDapper)
        {
            _produitCermRepository = produitCermRepository;
            _context = context;
            _produitCermRepositoryDapper = produitCermRespositoryDapper;
        }
        public async Task<IEnumerable<ProduitCerm>> GetAllAsync()
        {
            return await _produitCermRepository.GetAllAsync();
        }
        public async Task<ProduitCerm?> GetByIdAsync(int id)
        {
            return await _produitCermRepository.GetByIdAsync(id);


        }
    }
}
