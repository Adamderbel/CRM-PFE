using CRM.Entities.Crm;
using CRM.Entities.Security;
using CRM.Services;
using CRM.Services.Email;
using CRM.Services.FamilleProduits;
using CRM.Services.LigneProspections;
using CRM.Services.prospections;
using CRM.Services.Societe;
using CRM.Services.StatutPrespection;
using CRM.Services.SupportProduits;
using CRM.WebAPI.DTOs;
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
    public class LigneProspectionController : ControllerBase
    {
        private readonly ILigneProspectionService _ligneProspectionService;
        private readonly IProspectService _prospectService;
        private readonly IstatutProspectionService _statutProspectionService;
        private readonly IProspectionServices _prospectionServices;
        private readonly ISupportProduitService _supportProduitService;
        private readonly IFamilleProduitService _familleProduitService;
        private readonly ISocieteeService _societeeService;
        private readonly IEmailService _emailService;
        private readonly UserManager<SecUser> _userManager;

        public LigneProspectionController(
            ILigneProspectionService ligneProspectionService,
            IProspectService prospectService,
            IstatutProspectionService statutProspectionService,
            IProspectionServices prospectionServices,
            ISupportProduitService supportProduitService,
            IFamilleProduitService familleProduitService,
            ISocieteeService societeeService,
            IEmailService emailService,
            UserManager<SecUser> userManager)
        {
            _ligneProspectionService = ligneProspectionService;
            _prospectService = prospectService;
            _statutProspectionService = statutProspectionService;
            _prospectionServices = prospectionServices;
            _supportProduitService = supportProduitService;
            _familleProduitService = familleProduitService;
            _societeeService = societeeService;
            _emailService = emailService;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var principal = await ResolveCurrentSecUserAsync(User);
            var ligneProspections = await _ligneProspectionService.GetAllAsync(principal?.Id, GetCurrentRole());
            return Ok(ligneProspections);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var ligneProspection = await _ligneProspectionService.GetByIdAsync(id);
            if (ligneProspection == null || !await CanAccessProspectionAsync(ligneProspection.ProspectionId))
                return NotFound();

            return Ok(ligneProspection);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] LigneProspectionUpdateDto dto)
        {
            var ligne = await _ligneProspectionService.GetByIdAsync(id);
            if (ligne == null || !await CanAccessProspectionAsync(ligne.ProspectionId))
                return NotFound("Ligne Prospection not found.");

            if (!await CanAccessProspectionAsync(dto.ProspectionId))
                return NotFound("Prospection not found.");

            ligne.Designation = dto.Designation;
            ligne.FamilleProduitId = dto.FamilleProduitId;
            ligne.SupportProduitId = dto.SupportProduitId;
            ligne.ProspectionId = dto.ProspectionId;
            ligne.SocieteeId = dto.SocieteeId;
            ligne.StatutId = dto.StatutId;
            ligne.Date = dto.Date;

            await _ligneProspectionService.UpdateAsync(ligne);
            return Ok("Ligne Prospection updated successfully.");
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LigneProspectionCreateDto dto)
        {
            if (dto == null)
                return BadRequest("Ligne Prospection data is null.");

            var prospection = await _prospectionServices.GetByIdAsync(dto.ProspectionId);
            if (prospection == null || !await CanAccessProspectionAsync(dto.ProspectionId))
                return BadRequest("Invalid ProspectionId: Prospection not found.");

            var statut = await _statutProspectionService.GetByIdAsync(dto.StatutId);
            if (statut == null)
                return BadRequest("Invalid StatutId.");

            var supportProduit = await _supportProduitService.GetByIdAsync(dto.SupportProduitId);
            if (supportProduit == null)
                return BadRequest("Invalid SupportProduitId.");

            var familleProduit = await _familleProduitService.GetByIdAsync(dto.FamilleProduitId);
            if (familleProduit == null)
                return BadRequest("Invalid FamilleProduitId.");

            var societee = await _societeeService.GetByIdAsync(dto.SocieteeId);
            if (societee == null)
                return BadRequest("Invalid SocieteeId.");

            var ligneProspection = new LigneProspection
            {
                Designation = dto.Designation,
                FamilleProduitId = dto.FamilleProduitId,
                SupportProduitId = dto.SupportProduitId,
                ProspectionId = dto.ProspectionId,
                SocieteeId = dto.SocieteeId,
                StatutId = dto.StatutId,
                Date = dto.Date
            };

            await _ligneProspectionService.CreateAsync(ligneProspection);
            return Ok("Ligne prospection created successfully.");
        }

        [HttpPost("{id}/close")]
        public async Task<IActionResult> Close(Guid id, int? causeEchecId)
        {
            var ligne = await _ligneProspectionService.GetByIdAsync(id);
            if (ligne == null || !await CanAccessProspectionAsync(ligne.ProspectionId))
                return NotFound();

            await _ligneProspectionService.CloseAsync(id, causeEchecId);
            return Ok("Ligne cloturee");
        }

        [HttpPost("{id}/devis")]
        public async Task<IActionResult> DemanderDevis(Guid id, [FromBody] DevisRequestDto dto)
        {
            var ligne = await _ligneProspectionService.GetByIdAsync(id);
            if (ligne == null || !await CanAccessProspectionAsync(ligne.ProspectionId))
                return NotFound("Ligne Prospection not found.");

            if (ligne.FamilleProduitId != 0)
                ligne.FamilleProduit = await _familleProduitService.GetByIdAsync(ligne.FamilleProduitId);

            if (ligne.SupportProduitId.HasValue)
                ligne.SupportProduit = await _supportProduitService.GetByIdAsync(ligne.SupportProduitId.Value);

            if (ligne.ProspectionId != Guid.Empty)
            {
                ligne.Prospection = await _prospectionServices.GetByIdAsync(ligne.ProspectionId);
                if (ligne.Prospection?.ProspectId.HasValue == true)
                    ligne.Prospection.Prospect = await _prospectService.GetByIdAsync(ligne.Prospection.ProspectId.Value);
            }

            await _emailService.SendDevisEmailAsync(ligne, dto.Email, dto.Notes, dto.Date);
            ligne.DateDemandeOffre = DateTime.Now;
            await _ligneProspectionService.UpdateAsync(ligne);

            return Ok("Demande de devis traitee avec succes.");
        }

        private string? GetCurrentRole()
            => User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role || c.Type.EndsWith("/role", StringComparison.OrdinalIgnoreCase))?.Value;

        private bool IsCommercial()
            => string.Equals(GetCurrentRole(), "COMMERCIAL", StringComparison.OrdinalIgnoreCase)
            || string.Equals(GetCurrentRole(), "Commercial", StringComparison.OrdinalIgnoreCase);

        private async Task<bool> CanAccessProspectionAsync(Guid prospectionId)
        {
            if (!IsCommercial())
                return true;

            var principal = await ResolveCurrentSecUserAsync(User);
            var prospection = await _prospectionServices.GetByIdAsync(prospectionId);
            return prospection?.UserId == principal?.Id;
        }

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
