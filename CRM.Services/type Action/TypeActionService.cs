using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.Entities.Comm;
using CRM.Entities.Crm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.type_Action
{
    public class TypeActionService : ITypeActionService
    {
        private readonly IGenericRepository<TypeActionProspection> _TypeActionRepository;
        private readonly DataContext _context;

        public TypeActionService(IGenericRepository<TypeActionProspection> TypeActionRepository, DataContext dataContext)
        {
            _TypeActionRepository = TypeActionRepository;
            _context = dataContext;
        }

        public Task<IEnumerable<TypeActionProspection>> GetAllAsync()
        {
            return _TypeActionRepository.GetAllAsync();
        }

        public Task<TypeActionProspection?> GetByIdAsync(int id)
        {
            return _TypeActionRepository.GetByIdAsync(id);
        }
    }
}
