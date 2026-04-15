using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.Entities.Comm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.CauseEchecs
{
    public class CauseEchecService: ICauseEchecService
    {
        private readonly IGenericRepository<CauseEchec> _CauseEchecRespository;
        private readonly DataContext _context;


        public CauseEchecService(IGenericRepository<CauseEchec> CauseEchecRespository, DataContext dataContext)
        {
            _CauseEchecRespository = CauseEchecRespository;
            _context = dataContext;
        }

        public Task<IEnumerable<CauseEchec>> GetAllAsync()
        {
            return _CauseEchecRespository.GetAllAsync();
        }

        public Task<CauseEchec?> GetByIdAsync(int id)
        {
            return _CauseEchecRespository.GetByIdAsync(id);
        }
    }
}
