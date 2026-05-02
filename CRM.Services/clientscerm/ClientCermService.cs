using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using CRM.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.clientscerm
{
    public class ClientCermService : IClientCermService
    {
        private readonly IGenericRepository<ClientCerm> _clientCermRepository;
        private readonly DataContext _context;

        public ClientCermService(IGenericRepository<ClientCerm> clientCermRepository, DataContext context)
        {
            _clientCermRepository = clientCermRepository;
            _context = context;
        }

        public async Task<IEnumerable<ClientCerm>> GetAllAsync()
        {
            return await _clientCermRepository.GetAllAsync();
        }

        public async Task<ClientCerm?> GetByIdAsync(int id)
        {
            return await _clientCermRepository.GetByIdAsync(id);
        }
    }
}
