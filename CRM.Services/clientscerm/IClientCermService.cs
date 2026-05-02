using CRM.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.clientscerm
{
    public interface IClientCermService
    {
        Task<IEnumerable<ClientCerm>> GetAllAsync();
        Task<ClientCerm?> GetByIdAsync(int id);
    }
}
