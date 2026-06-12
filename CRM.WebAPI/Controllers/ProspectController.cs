using CRM.Entities.Common;
using CRM.Entities.Crm;
using CRM.Services;
using CRM.WebAPI.DTOs;
using CRM.Entities.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "COMMERCIAL,MANAGER,ADMIN")]
    public class ProspectController : ControllerBase
    {
        private readonly IProspectService _prospectService;
        private readonly IDomaineActiviteService _domaineActiviteService;
        private readonly UserManager<SecUser> _userManager;

        public ProspectController(IProspectService prospectService, IDomaineActiviteService domaineActiviteService, UserManager<SecUser> userManager)
        {
            _prospectService = prospectService;
            _domaineActiviteService = domaineActiviteService;
            _userManager = userManager;
        }

        // GET: api/prospect
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var principal = await ResolveCurrentSecUserAsync(User);
            var role = GetCurrentRole();
            var prospects = await _prospectService.GetAllAsync(principal?.Id, role);
            foreach (var item in prospects)
            {
                 item.DomaineActivite = await _domaineActiviteService.GetByIdAsync(item.idDomaineActivitee);

            }
            return Ok(prospects);
        }
        // GET: api/prospect
        [HttpGet]
        [Route("getAllDapper")]
        public async Task<IActionResult> GetAllDapper()
        {
            var principal = await ResolveCurrentSecUserAsync(User);
            var role = GetCurrentRole();
            var prospects = await _prospectService.GetAllAsyncDapper(principal?.Id, role);
            return Ok(prospects);
        }

        // GET: api/prospect/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            Prospect? prospect = await _prospectService.GetByIdAsync(id);
           
            if (prospect == null)
                return NotFound();

            var principal = await ResolveCurrentSecUserAsync(User);
            if (IsCommercial() && prospect.UserId.HasValue && prospect.UserId != principal?.Id)
                return NotFound();

            prospect.DomaineActivite = await _domaineActiviteService.GetByIdAsync(prospect.idDomaineActivitee);




            return Ok(prospect);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProspectDTO prospectDto)
        {
            try
            {
                if (prospectDto == null)
                    return BadRequest("Invalid data.");

                var principal = await ResolveCurrentSecUserAsync(User);
                if (principal == null)
                    return Unauthorized();

                var domaineId = prospectDto.IdDomaineActivite ?? prospectDto.idDomaineActivitee;
                var domaine = await _domaineActiviteService.GetByIdAsync(domaineId);

                if (domaine == null)
                    return NotFound("DomaineActivite not found.");

                var prospect = new Prospect
                {   
                    Nom = prospectDto.Nom,
                    Prenom = prospectDto.Prenom,
                    Email = prospectDto.Email,
                    Telephone = prospectDto.Telephone,
                    Source = prospectDto.Source,
                    DateCreation = prospectDto.DateCreation ?? DateTime.Now,
                    Notes = prospectDto.Notes,
                    idDomaineActivitee = domaineId,
                    UserId = principal.Id
                };

                await _prospectService.CreateAsync(prospect);

                return Ok("Prospect created successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProspectDTO dto)
        {
            if (dto == null)
                return BadRequest("Invalid data.");

            var existingProspect = await _prospectService.GetByIdAsync(id);

            if (existingProspect == null)
                return NotFound("Prospect not found.");

            // Update fields
            existingProspect.Nom = dto.Nom;
            existingProspect.Prenom = dto.Prenom;
            existingProspect.Email = dto.Email;
            existingProspect.Telephone = dto.Telephone;
            existingProspect.Source = dto.Source;
            existingProspect.Notes = dto.Notes;
            var principal = await ResolveCurrentSecUserAsync(User);
            if (IsCommercial() && existingProspect.UserId.HasValue && existingProspect.UserId != principal?.Id)
                return NotFound("Prospect not found.");

            existingProspect.idDomaineActivitee = dto.idDomaineActivitee;

            await _prospectService.UpdateAsync(existingProspect);

            // Return updated prospect with DomaineActivite populated
            existingProspect.DomaineActivite = await _domaineActiviteService.GetByIdAsync(existingProspect.idDomaineActivitee);

            return Ok(existingProspect); // Return updated prospect with all populated data
        }

        // DELETE: api/prospect/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existingProspect = await _prospectService.GetByIdAsync(id);
            var principal = await ResolveCurrentSecUserAsync(User);
            if (existingProspect == null || (IsCommercial() && existingProspect.UserId.HasValue && existingProspect.UserId != principal?.Id))
                return NotFound();

            await _prospectService.DeleteAsync(id);
            return Ok();
        }

        private string? GetCurrentRole()
            => User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role || c.Type.EndsWith("/role", StringComparison.OrdinalIgnoreCase))?.Value;

        private bool IsCommercial()
            => string.Equals(GetCurrentRole(), "COMMERCIAL", StringComparison.OrdinalIgnoreCase)
            || string.Equals(GetCurrentRole(), "Commercial", StringComparison.OrdinalIgnoreCase);

        private async Task<SecUser?> ResolveCurrentSecUserAsync(ClaimsPrincipal claimsPrincipal)
        {
            var user = await _userManager.GetUserAsync(claimsPrincipal);
            if (user != null)
                return user;

            var idStr = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? claimsPrincipal.FindFirstValue(JwtRegisteredClaimNames.Sub)
                ?? claimsPrincipal.FindFirstValue("sub");

            return Guid.TryParse(idStr, out var id)
                ? await _userManager.FindByIdAsync(id.ToString())
                : null;
        }

    }
}
