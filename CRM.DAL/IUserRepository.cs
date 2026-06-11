using CRM.Entities.Security;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.DAL
{
    public interface IUserRepository
    {
        Task<IEnumerable<SecUser>> GetAllAsync();
        Task<SecUser?> GetByEmailAsync(string email);
        void AddAsync(SecUser user);
        Task AddUserRoleAsync(UserRole userRole);
        Task SaveAsync();
        Task<SecRole?> GetRoleByNameAsync(string roleName);
        Task<IEnumerable<UserRole>> GetRolesByRoleIdAsync(Guid roleId);
        Task<SecUser?> GetByIdAsync(Guid id);
    }
}
