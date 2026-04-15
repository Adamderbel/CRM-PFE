using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CRM.Entities.Comm;

namespace CRM.Services.Societe
{
    public class SocieteeService : ISocieteeService
    {
        private readonly IGenericRepository<Societee> _societeeRepository;
        private readonly DataContext _context;
        public SocieteeService(IGenericRepository<Societee> societeeRepository, DataContext context)
        {
            _societeeRepository = societeeRepository;
            _context = context;
        }

        public Task<IEnumerable<Entities.Comm.Societee>> GetAllAsync()
        {
            return _societeeRepository.GetAllAsync();
        }
        public Task<Entities.Comm.Societee?> GetByIdAsync(int? id)
        {
            return _societeeRepository.GetByIdAsync(id);

        }
    }
}
