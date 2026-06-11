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
                    Roles = roles
                });
            }

            return Ok(result);
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

            if (!await _roleManager.RoleExistsAsync(normalizedRole))
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

            var addResult = await _userManager.AddToRoleAsync(user, normalizedRole);
            if (!addResult.Succeeded)
                return StatusCode(500, new { error = string.Join("; ", addResult.Errors.Select(e => e.Description)) });

            return Ok();
        }
    }
}
