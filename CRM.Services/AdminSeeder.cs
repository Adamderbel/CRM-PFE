using CRM.Entities.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace CRM.Services
{
    public class AdminSeeder : IAdminSeeder
    {
        private readonly RoleManager<SecRole> _roleManager;
        private readonly UserManager<SecUser> _userManager;
        private readonly IConfiguration _config;

        public AdminSeeder(RoleManager<SecRole> roleManager, UserManager<SecUser> userManager, IConfiguration config)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _config = config;
        }

        public async Task SeedAsync()
        {
            try
            {
                await SeedRolesAsync();
                await SeedAdminAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("AdminSeeder error: " + ex.Message);
            }
        }

        private async Task SeedRolesAsync()
        {
            foreach (var roleName in new[] { "ADMIN", "MANAGER", "COMMERCIAL" })
            {
                if (await _roleManager.RoleExistsAsync(roleName))
                    continue;

                var result = await _roleManager.CreateAsync(new SecRole
                {
                    Name = roleName,
                    NormalizedName = roleName
                });

                if (!result.Succeeded)
                    Console.WriteLine($"Unable to create role {roleName}: {string.Join("; ", result.Errors.Select(e => e.Description))}");
            }
        }

        private async Task SeedAdminAsync()
        {
            var email = Environment.GetEnvironmentVariable("ADMIN_EMAIL");
            if (string.IsNullOrWhiteSpace(email))
                email = _config["AdminSeed:Email"];

            var password = Environment.GetEnvironmentVariable("ADMIN_PASSWORD");
            if (string.IsNullOrWhiteSpace(password))
                password = _config["AdminSeed:Password"];

            var username = Environment.GetEnvironmentVariable("ADMIN_USERNAME");
            if (string.IsNullOrWhiteSpace(username))
                username = _config["AdminSeed:UserName"] ?? email;

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(username))
                return;

            var existing = await _userManager.FindByEmailAsync(email);
            if (existing != null)
            {
                var changed = false;
                if (!existing.IsActive)
                {
                    existing.IsActive = true;
                    changed = true;
                }

                if (!await _userManager.IsInRoleAsync(existing, "ADMIN"))
                {
                    var roleResult = await _userManager.AddToRoleAsync(existing, "ADMIN");
                    changed = changed || roleResult.Succeeded;
                }

                if (changed)
                    await _userManager.UpdateAsync(existing);

                return;
            }

            if ((await _userManager.GetUsersInRoleAsync("ADMIN")).Any())
                return;

            var admin = new SecUser
            {
                Id = Guid.NewGuid(),
                Email = email.Trim(),
                NormalizedEmail = email.Trim().ToUpperInvariant(),
                UserName = username.Trim(),
                NormalizedUserName = username.Trim().ToUpperInvariant(),
                Nom = "Admin",
                Prenom = "System",
                IsActive = true
            };

            var createResult = await _userManager.CreateAsync(admin, password);
            if (!createResult.Succeeded)
            {
                Console.WriteLine($"Unable to create admin: {string.Join("; ", createResult.Errors.Select(e => e.Description))}");
                return;
            }

            await _userManager.AddToRoleAsync(admin, "ADMIN");
        }
    }
}
