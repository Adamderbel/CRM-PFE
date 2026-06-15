using CRM.Entities.Security;
using CRM.Services;
using CRM.WebAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "ADMIN")]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<SecUser> _userManager;
        private readonly RoleManager<SecRole> _roleManager;
        private readonly IUserService _userService;

        public UsersController(UserManager<SecUser> userManager, RoleManager<SecRole> roleManager, IUserService userService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            var result = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new UserDto
                {
                    Id = user.Id,
                    Email = user.Email ?? string.Empty,
                    UserName = user.UserName ?? string.Empty,
                    Nom = user.Nom ?? string.Empty,
                    Prenom = user.Prenom ?? string.Empty,
                    IsActive = user.IsActive,
                    Roles = roles.Select(NormalizeRoleName).Where(role => !string.IsNullOrWhiteSpace(role)).ToList()
                });
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto request)
        {
            if (request == null)
                return BadRequest("Le corps de la requete est invalide.");

            if (string.IsNullOrWhiteSpace(request.Email)
                || string.IsNullOrWhiteSpace(request.UserName)
                || string.IsNullOrWhiteSpace(request.Password)
                || string.IsNullOrWhiteSpace(request.Role))
            {
                return BadRequest("Les champs Email, UserName, Password et Role sont obligatoires.");
            }

            var normalizedRole = request.Role.Trim().ToUpperInvariant();
            var validRoles = new[] { "ADMIN", "MANAGER", "COMMERCIAL" };
            if (!validRoles.Contains(normalizedRole))
                return BadRequest($"Role invalide. Les roles autorises sont : {string.Join(", ", validRoles)}");

            var role = await _roleManager.FindByNameAsync(normalizedRole);
            if (role == null || string.IsNullOrWhiteSpace(role.Name))
                return BadRequest("Le role demande n'existe pas.");

            var email = request.Email.Trim();
            var userName = request.UserName.Trim();

            if (await _userManager.FindByEmailAsync(email) != null)
                return BadRequest("Un utilisateur avec cet email existe deja.");

            if (await _userManager.FindByNameAsync(userName) != null)
                return BadRequest("Un utilisateur avec ce nom d'utilisateur existe deja.");

            var user = new SecUser
            {
                Email = email,
                UserName = userName,
                Nom = request.Nom?.Trim() ?? string.Empty,
                Prenom = request.Prenom?.Trim() ?? string.Empty,
                IsActive = true
            };

            var createResult = await _userManager.CreateAsync(user, request.Password);
            if (!createResult.Succeeded)
                return BadRequest(new { error = string.Join("; ", createResult.Errors.Select(e => e.Description)) });

            var roleResult = await _userManager.AddToRoleAsync(user, role.Name);
            if (!roleResult.Succeeded)
                return StatusCode(500, new { error = string.Join("; ", roleResult.Errors.Select(e => e.Description)) });

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                userName = user.UserName,
                nom = user.Nom,
                prenom = user.Prenom,
                isActive = user.IsActive,
                roles = new[] { NormalizeRoleName(role.Name) }
            });
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(Guid id, [FromBody] UserStatusDto request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Action))
                return BadRequest("Action requise.");

            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
                return NotFound("Utilisateur introuvable.");

            var action = request.Action.Trim().ToUpperInvariant();
            if (action == "APPROVE")
                user.IsActive = true;
            else if (action == "REJECT")
                user.IsActive = false;
            else
                return BadRequest("Action invalide. Utilisez APPROVE ou REJECT.");

            user.Nom ??= string.Empty;
            user.Prenom ??= string.Empty;
            user.SecurityStamp ??= Guid.NewGuid().ToString();

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                return StatusCode(500, new { error = string.Join("; ", updateResult.Errors.Select(e => e.Description)) });

            return Ok();
        }

        [HttpPatch("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(Guid id, [FromBody] UpdateUserRoleDto request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Role))
                return BadRequest("Role requis.");

            var normalizedRole = request.Role.Trim().ToUpperInvariant();
            var validRoles = new[] { "ADMIN", "MANAGER", "COMMERCIAL" };
            if (!validRoles.Contains(normalizedRole))
                return BadRequest($"Role invalide. Les roles autorises sont : {string.Join(", ", validRoles)}");

            var role = await _roleManager.FindByNameAsync(normalizedRole);
            if (role == null || string.IsNullOrWhiteSpace(role.Name))
                return BadRequest("Le role demande n'existe pas.");

            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
                return NotFound("Utilisateur introuvable.");

            user.Nom ??= string.Empty;
            user.Prenom ??= string.Empty;

            var currentRoles = await _userManager.GetRolesAsync(user);
            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeResult.Succeeded)
                return StatusCode(500, new { error = string.Join("; ", removeResult.Errors.Select(e => e.Description)) });

            var addResult = await _userManager.AddToRoleAsync(user, role.Name);
            if (!addResult.Succeeded)
                return StatusCode(500, new { error = string.Join("; ", addResult.Errors.Select(e => e.Description)) });

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserDto request)
        {
            if (request == null
                || string.IsNullOrWhiteSpace(request.Email)
                || string.IsNullOrWhiteSpace(request.UserName)
                || string.IsNullOrWhiteSpace(request.Role))
            {
                return BadRequest("Email, nom utilisateur et role sont obligatoires.");
            }

            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
                return NotFound("Utilisateur introuvable.");

            var email = request.Email.Trim();
            var userName = request.UserName.Trim();
            var normalizedRole = request.Role.Trim().ToUpperInvariant();
            var validRoles = new[] { "ADMIN", "MANAGER", "COMMERCIAL" };

            if (!validRoles.Contains(normalizedRole))
                return BadRequest($"Role invalide. Les roles autorises sont : {string.Join(", ", validRoles)}");

            var role = await _roleManager.FindByNameAsync(normalizedRole);
            if (role == null || string.IsNullOrWhiteSpace(role.Name))
                return BadRequest("Le role demande n'existe pas.");

            var userWithEmail = await _userManager.FindByEmailAsync(email);
            if (userWithEmail != null && userWithEmail.Id != id)
                return BadRequest("Un utilisateur avec cet email existe deja.");

            var userWithName = await _userManager.FindByNameAsync(userName);
            if (userWithName != null && userWithName.Id != id)
                return BadRequest("Un utilisateur avec ce nom d'utilisateur existe deja.");

            user.Email = email;
            user.UserName = userName;
            user.Nom = request.Nom?.Trim() ?? string.Empty;
            user.Prenom = request.Prenom?.Trim() ?? string.Empty;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                return BadRequest(new { error = string.Join("; ", updateResult.Errors.Select(e => e.Description)) });

            var currentRoles = await _userManager.GetRolesAsync(user);
            if (!currentRoles.Any(currentRole => string.Equals(currentRole, role.Name, StringComparison.OrdinalIgnoreCase)))
            {
                var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                if (!removeResult.Succeeded)
                    return StatusCode(500, new { error = string.Join("; ", removeResult.Errors.Select(e => e.Description)) });

                var addResult = await _userManager.AddToRoleAsync(user, role.Name);
                if (!addResult.Succeeded)
                    return StatusCode(500, new { error = string.Join("; ", addResult.Errors.Select(e => e.Description)) });
            }

            return Ok(new UserDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                UserName = user.UserName ?? string.Empty,
                Nom = user.Nom,
                Prenom = user.Prenom,
                IsActive = user.IsActive,
                Roles = new[] { NormalizeRoleName(role.Name) }
            });
        }

        private static string NormalizeRoleName(string? role)
        {
            var normalizedRole = role?.Trim().ToUpperInvariant();
            return normalizedRole switch
            {
                "ADMIN" => "ADMIN",
                "MANAGER" => "MANAGER",
                "COMMERCIAL" => "COMMERCIAL",
                _ => string.Empty
            };
        }
    }
}
