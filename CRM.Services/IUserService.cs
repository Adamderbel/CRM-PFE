using CRM.Entities.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services
{
    public interface IUserService
    {
        public Task CreateUserAsync(SecUser user, string plainPassword, string roleName);
        public Task<SecRole?> GetRoleByRoleName(string roleName);
        public Task<IEnumerable<UserRole>> GetRolesByRoleIdAsync(Guid roleId);



    }
}
