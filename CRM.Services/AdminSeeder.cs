using CRM.DAL;
using CRM.Entities.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services
{
    public class AdminSeeder : IAdminSeeder
    {
        private readonly IUserService _userService;
        private readonly IPasswordHasher<SecUser> _passwordHasher;
        private readonly IConfiguration _config;
        public AdminSeeder(IUserService userService, IPasswordHasher<SecUser> passwordHasher, IConfiguration config)
        {
            _userService = userService;
            _passwordHasher = passwordHasher;
            _config = config;
        }
        public async Task SeedAsync()
        {
            try
            {


                // verifier Admin existe deja 
                var adminRole = await _userService.GetRoleByRoleName("ADMIN");
                if (adminRole == null)
                    return;

                var adminExiste = await _userService.GetRolesByRoleIdAsync(adminRole.Id);

                if (adminExiste is null)
                    return;
                // cree admin 

                var email = _config["AdminSeed:Email"]!;
                var password = _config["AdminSeed:Password"]!;

                var user = new SecUser
                {
                    Id = Guid.NewGuid(),
                    Email = email,
                    NormalizedEmail = email.ToUpper(),
                    UserName = email,
                    NormalizedUserName = email.ToUpper(),
                };
                await _userService.CreateUserAsync(user, user.PasswordHash, adminRole.NormalizedName);
            }
            catch (Exception ex)
            {
                // LOG seulement, jamais throw
                Console.WriteLine("AdminSeeder error: " + ex.Message);
            }

        }
    }
}
