using CRM.Entities.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.DAL
{
    public class UserRepository : IUserRepository
    {
        private readonly SecurityDbContext _securityDbContext;
        public UserRepository(SecurityDbContext securityDbContext)
        {
           _securityDbContext = securityDbContext;     
        }
        public  void AddAsync(SecUser user)
          => _securityDbContext.Users.Add(user);
        public async Task AddUserRoleAsync(UserRole userRole)
        {
             await _securityDbContext.UserRoles.AddAsync(userRole);
        }

        public  Task<SecUser?> GetByEmailAsync(string email)
           =>  _securityDbContext.Users.FirstOrDefaultAsync(u=> u.NormalizedEmail == email.ToUpper());

        public  Task SaveAsync() 
            =>  _securityDbContext.SaveChangesAsync();

        public Task<SecRole?> GetRoleByNameAsync(string roleName)
    => _securityDbContext.Roles
        .FirstOrDefaultAsync(r => r.NormalizedName == roleName.ToUpper());

        public async Task<IEnumerable<UserRole>> GetRolesByRoleIdAsync(Guid roleId)
        {
            return await _securityDbContext.UserRoles.Where(ur => ur.RoleId == roleId).ToListAsync();
        }

        public Task<SecUser> GetByIdAsync(Guid id)
        {
            return _securityDbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
        }
    }
}
