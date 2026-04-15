using CRM.DAL;
using CRM.Entities.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly PasswordHasher<SecUser> _passwordHasher = new();

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task CreateUserAsync(SecUser user, string plainPassword, string roleName)
        {
            user.PasswordHash = _passwordHasher.HashPassword(user, plainPassword);
            _userRepository.AddAsync(user);
            var role = await _userRepository.GetRoleByNameAsync(roleName);
            if (role != null)
            {
                await _userRepository.AddUserRoleAsync(new UserRole
                {
                    UserId = user.Id,
                    RoleId = role.Id
                });

            }

            await _userRepository.SaveAsync();

        }

        public async Task<SecRole?> GetRoleByRoleName(string roleName)
        {
            return await _userRepository.GetRoleByNameAsync(roleName);
        }

        public async Task<IEnumerable<UserRole>> GetRolesByRoleIdAsync(Guid roleId)
        {
            return await GetRolesByRoleIdAsync(roleId);
        }
        public async Task<SecUser?> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetByEmailAsync(email);
        }
        public async Task<SecUser?> GetByIdAsync(Guid id)
        {
            return await _userRepository.GetByIdAsync(id);
        }
    }
}