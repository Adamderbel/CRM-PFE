using CRM.Entities.Security;
using CRM.Services;
using CRM.WebAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<SecUser> _userManager;
        private readonly IConfiguration _config;
        private readonly IUserService _userService;

        public AuthController(UserManager<SecUser> userManager, IConfiguration config, IUserService userService)
        {
            _userManager = userManager;
            _config = config;
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
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
            if (normalizedRole == "ADMIN")
                return BadRequest("Le role ADMIN est reserve au systeme.");

            var validRoles = new[] { "MANAGER", "COMMERCIAL" };
            if (!validRoles.Contains(normalizedRole))
                return BadRequest($"Role invalide. Les roles autorises sont : {string.Join(", ", validRoles)}");

            if (await _userManager.FindByEmailAsync(request.Email.Trim()) != null)
                return BadRequest("Un utilisateur avec cet email existe deja.");

            if (await _userManager.FindByNameAsync(request.UserName.Trim()) != null)
                return BadRequest("Un utilisateur avec ce nom d'utilisateur existe deja.");

            var user = new SecUser
            {
                Email = request.Email.Trim(),
                NormalizedEmail = request.Email.Trim().ToUpperInvariant(),
                UserName = request.UserName.Trim(),
                NormalizedUserName = request.UserName.Trim().ToUpperInvariant(),
                Nom = request.Nom?.Trim() ?? string.Empty,
                Prenom = request.Prenom?.Trim() ?? string.Empty,
                IsActive = false
            };

            await _userService.CreateUserAsync(user, request.Password, normalizedRole);

            return Ok(new { message = $"Utilisateur {request.UserName} cree avec le role {normalizedRole}." });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null || string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
                return BadRequest("Email et mot de passe sont requis.");

            var user = await _userManager.FindByEmailAsync(loginDto.Email.Trim());
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized("Email ou mot de passe incorrect.");

            if (!user.IsActive)
                return Unauthorized("Le compte n'est pas encore active par un administrateur.");

            var roles = await _userManager.GetRolesAsync(user);
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName ?? string.Empty),
                new Claim("IsActive", user.IsActive.ToString())
            };
            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r.ToUpperInvariant())));

            var jwtKey = _config["Jwt:Key"];
            if (string.IsNullOrWhiteSpace(jwtKey))
                throw new InvalidOperationException("JWT Key is not configured");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: creds);

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo,
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    userName = user.UserName,
                    nom = user.Nom,
                    prenom = user.Prenom,
                    roles
                }
            });
        }
    }
}
