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

       // [Authorize(Roles = "ADMIN")]
        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto request)
        {
            var user = new SecUser
            {
                Email = request.Email,
                NormalizedEmail = request.Email.Trim().ToUpper(),
                UserName = request.UserName.Trim(),
                NormalizedUserName = request.UserName.Trim().ToUpper(),
                Nom = request.Nom , 
                Prenom= request.Prenom



            }; 

            await _userService.CreateUserAsync(user, request.Password, request.Role);

            return Ok();
        }

      
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                // On récupère l'utilisateur via l'email
                var user = await _userManager.FindByEmailAsync(loginDto.Email);
                if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                {
                    return Unauthorized("Email ou mot de passe incorect");
                }
                // Récupérer les rôles 
                var roles = await _userManager.GetRolesAsync(user);

                // Claims pour JWT 

                var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                new Claim("IsActive" , user.IsActive.ToString())

            };
                claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));


                // Génération du token
                var jwtKey = _config["Jwt:Key"];
                if (string.IsNullOrEmpty(jwtKey))
                    throw new InvalidOperationException("JWT Key is not configured");

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                 issuer: _config["Jwt:Issuer"],
                 audience: _config["Jwt:Audience"],
                 claims: claims,
                 expires: DateTime.UtcNow.AddHours(24),
                 signingCredentials: creds
                );

                return Ok(new
                {
                    
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo , 
                    user = new
                    {
                        id=user.Id , 
                        email = user.Email , 
                        userName = user.UserName , 
                        nom = user.Nom , 
                        prenom = user.Prenom,
                        roles = roles 
                    }

                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }

    }

}
