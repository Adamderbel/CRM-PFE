using CRM.Entities.Crm;
using CRM.Entities.Security;
using CRM.Services;
using CRM.Services.ActionProspection;
using CRM.Services.clientscerm;
using CRM.Services.prospections;
using CRM.Services.StatutPrespection;
using CRM.WebAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CRM.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "COMMERCIAL,MANAGER,ADMIN")]
    public class ProspectionController : ControllerBase
    {

        private readonly IProspectionServices _prospectionServices;
        private readonly IstatutProspectionService _statutProspectionService;
        private readonly IProspectService _prospectService;
        private readonly IClientCermService _clientCermService;
        private readonly IUserService _userService;
        private readonly UserManager<SecUser> _userManager;
        private readonly IActionProspectionService _actionProspectionService;



        public ProspectionController(
            IUserService userService,
            UserManager<SecUser> userManager,
            IProspectionServices prospectionServices,
            IstatutProspectionService statutProspectionService,
            IProspectService prospectService,
            IClientCermService clientCermService,
            IActionProspectionService actionProspectionService)
        {
            _prospectionServices = prospectionServices;
            _statutProspectionService = statutProspectionService;
            _prospectService = prospectService;
            _clientCermService = clientCermService;
            _userService = userService;
            _userManager = userManager;
            _actionProspectionService = actionProspectionService;

        }

        [HttpPost]
        public async Task<IActionResult> CreateProspection([FromBody] ProspectionCreateDto prospectionDto)
        {
            if (prospectionDto == null) return BadRequest("Prospection data is null.");

            try
            {
                var principal = await ResolveCurrentSecUserAsync(User);
                if (principal == null)
                    return Unauthorized();

                if (prospectionDto.ProspectId.HasValue == prospectionDto.ClientId.HasValue)
                    return BadRequest("La prospection doit être associée soit à un prospect, soit à un client.");

                if (prospectionDto.ProspectId.HasValue)
                {
                    var prospect = await _prospectService.GetByIdAsync(prospectionDto.ProspectId.Value);
                    if (prospect == null) return BadRequest("Invalid ProspectId: Prospect not found.");
                }

                if (prospectionDto.ClientId.HasValue)
                {
                    var client = await _clientCermService.GetByIdAsync(prospectionDto.ClientId.Value);
                    if (client == null) return BadRequest("Invalid ClientId: Client not found.");
                }

                var statut = await _statutProspectionService.GetByIdAsync(prospectionDto.StatutId);
                if (statut == null) return BadRequest($"Invalid StatutId: Statut with ID {prospectionDto.StatutId} not found.");
                var effectiveUserId = principal.Id;
                if (IsElevated() && prospectionDto.UserId.HasValue && prospectionDto.UserId.Value != Guid.Empty)
                {
                    var user = await _userService.GetByIdAsync(prospectionDto.UserId.Value);
                    if (user == null) return BadRequest("Invalid UserId: User not found.");
                    effectiveUserId = user.Id;
                }

                var pros = new Prospection
                {
                    
                    DateDebut = prospectionDto.DateDebut,
                    DateFin = prospectionDto.DateFin,
                    Notes = prospectionDto.Notes,
                    StatutId = prospectionDto.StatutId,
                    UserId = effectiveUserId,
                    ProspectId = prospectionDto.ProspectId,
                    ClientId = prospectionDto.ClientId
                };
                await _prospectionServices.CreateAsync(pros);

                if (prospectionDto.TypeActionId.HasValue)
                {
                    await _actionProspectionService.AddAsync(new ActionsProspection
                    {
                        ProspectionId = pros.Id,
                        TypeActionId = prospectionDto.TypeActionId.Value,
                        DateAction = DateTime.Now,
                        Commentaire = prospectionDto.CommentaireAction,
                        Resultat = prospectionDto.ResultatAction
                    });
                }

                return Ok(new { message = "Prospection created successfully." });
            }
            catch (Exception ex)
            {
                // Log the exception (not implemented here)
                return StatusCode(500, $"Internal server error: {ex.Message}");

            }
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var principal = await ResolveCurrentSecUserAsync(User);
                var prospections = await _prospectionServices.GetAllAsync(principal?.Id, GetCurrentRole());
                foreach (var item in prospections)
                {
                    if (item.StatutId.HasValue)
                    {
                        item.Statut = await _statutProspectionService.GetByIdAsync(item.StatutId.Value);
                    }
                    
                    if (item.ProspectId.HasValue)
                    {
                        item.Prospect = await _prospectService.GetByIdAsync(item.ProspectId.Value);
                    }

                    if (item.ClientId.HasValue)
                    {
                        item.Client = await _clientCermService.GetByIdAsync(item.ClientId.Value);
                    }

                    if (item.UserId.HasValue)
                    {
                        item.User = await _userService.GetByIdAsync(item.UserId.Value);
                    }
                }
                return Ok(prospections);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message, stack = ex.StackTrace });
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var prospection = await _prospectionServices.GetByIdAsync(id);
                if (prospection == null) return NotFound();
                if (IsCommercial() && prospection.UserId != (await ResolveCurrentSecUserAsync(User))?.Id)
                    return NotFound();

                if (prospection.StatutId.HasValue)
                    prospection.Statut = await _statutProspectionService.GetByIdAsync(prospection.StatutId.Value);

                if (prospection.ProspectId.HasValue)
                    prospection.Prospect = await _prospectService.GetByIdAsync(prospection.ProspectId.Value);

                if (prospection.ClientId.HasValue)
                    prospection.Client = await _clientCermService.GetByIdAsync(prospection.ClientId.Value);

                if (prospection.UserId.HasValue)
                    prospection.User = await _userService.GetByIdAsync(prospection.UserId.Value);

                return Ok(prospection);
            }
            catch (Exception ex)
            {
                // Log the exception (not implemented here)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("prospect/{prospectId}")]
        public async Task<IActionResult> GetByProspectId(Guid prospectId)
        {
            try
            {
                var principal = await ResolveCurrentSecUserAsync(User);
                var prospections = await _prospectionServices.GetByProspectIdAsync(prospectId);
                if (IsCommercial())
                    prospections = prospections.Where(p => p.UserId == principal?.Id).ToList();
                foreach (var item in prospections)
                {
                    if (item.StatutId.HasValue)
                    {
                        item.Statut = await _statutProspectionService.GetByIdAsync(item.StatutId.Value);
                    }
                    if (item.ProspectId.HasValue)
                    {
                        item.Prospect = await _prospectService.GetByIdAsync(item.ProspectId.Value);
                    }
                    if (item.UserId.HasValue)
                    {
                        item.User = await _userService.GetByIdAsync(item.UserId.Value);
                    }
                }
                return Ok(prospections);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message, stack = ex.StackTrace });
            }
        }

        [HttpGet("client/{clientId:int}")]
        public async Task<IActionResult> GetByClientId(int clientId)
        {
            try
            {
                var principal = await ResolveCurrentSecUserAsync(User);
                var prospections = await _prospectionServices.GetByClientIdAsync(clientId);
                if (IsCommercial())
                    prospections = prospections.Where(p => p.UserId == principal?.Id).ToList();

                foreach (var item in prospections)
                {
                    if (item.StatutId.HasValue)
                        item.Statut = await _statutProspectionService.GetByIdAsync(item.StatutId.Value);

                    if (item.ClientId.HasValue)
                        item.Client = await _clientCermService.GetByIdAsync(item.ClientId.Value);

                    if (item.UserId.HasValue)
                        item.User = await _userService.GetByIdAsync(item.UserId.Value);
                }

                return Ok(prospections);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message, stack = ex.StackTrace });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var prospection = await _prospectionServices.GetByIdAsync(id);
                if (prospection == null) return NotFound();
                if (IsCommercial() && prospection.UserId != (await ResolveCurrentSecUserAsync(User))?.Id)
                    return NotFound();
                await _prospectionServices.DeleteAsync(id);
                return Ok("Prospection deleted successfully.");
            }
            catch (Exception ex)
            {
                // Log the exception (not implemented here)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        } 
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ProspectionUpdateDto prospectionDto)
        {
            try
            {
                var existingProspection = await _prospectionServices.GetByIdAsync(id);
                if (existingProspection == null) return NotFound();
                var principal = await ResolveCurrentSecUserAsync(User);
                if (IsCommercial() && existingProspection.UserId != principal?.Id)
                    return NotFound();

                if (prospectionDto.ProspectId.HasValue == prospectionDto.ClientId.HasValue)
                    return BadRequest("La prospection doit etre associee soit a un prospect, soit a un client.");

                if (prospectionDto.ProspectId.HasValue)
                {
                    var prospect = await _prospectService.GetByIdAsync(prospectionDto.ProspectId.Value);
                    if (prospect == null) return BadRequest("Invalid ProspectId: Prospect not found.");
                }

                if (prospectionDto.ClientId.HasValue)
                {
                    var client = await _clientCermService.GetByIdAsync(prospectionDto.ClientId.Value);
                    if (client == null) return BadRequest("Invalid ClientId: Client not found.");
                }

                existingProspection.DateDebut = prospectionDto.DateDebut;
                existingProspection.DateFin = prospectionDto.DateFin;
                existingProspection.Notes = prospectionDto.Notes;
                existingProspection.StatutId = prospectionDto.StatutId;
                existingProspection.UserId = IsElevated() && prospectionDto.UserId.HasValue && prospectionDto.UserId.Value != Guid.Empty
                    ? prospectionDto.UserId
                    : existingProspection.UserId;
                existingProspection.ProspectId = prospectionDto.ProspectId;
                existingProspection.ClientId = prospectionDto.ClientId;
                await _prospectionServices.UpdateAsync(existingProspection);
                return Ok("Prospection updated successfully.");
            }
            catch (Exception ex)
            {
                // Log the exception (not implemented here)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }  
        private string? GetCurrentRole()
            => User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role || c.Type.EndsWith("/role", StringComparison.OrdinalIgnoreCase))?.Value;

        private bool IsCommercial()
            => string.Equals(GetCurrentRole(), "COMMERCIAL", StringComparison.OrdinalIgnoreCase)
            || string.Equals(GetCurrentRole(), "Commercial", StringComparison.OrdinalIgnoreCase);

        private bool IsElevated()
            => string.Equals(GetCurrentRole(), "MANAGER", StringComparison.OrdinalIgnoreCase)
            || string.Equals(GetCurrentRole(), "ADMIN", StringComparison.OrdinalIgnoreCase)
            || string.Equals(GetCurrentRole(), "Admin", StringComparison.OrdinalIgnoreCase);

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
