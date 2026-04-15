using CRM.Entities.Crm;
using CRM.Services;
using CRM.Services.FamilleProduits;
using CRM.Services.LigneProspections;
using CRM.Services.prospections;
using CRM.Services.Societe;
using CRM.Services.StatutPrespection;
using CRM.Services.SupportProduits;
using CRM.WebAPI.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LigneProspectionController : ControllerBase
    {
        private readonly ILigneProspectionService _ligneProspectionService;
        private readonly IProspectService _ProspectService;
        private readonly IstatutProspectionService _statutProspectionService;
        private readonly IProspectionServices _prospectionServices;
        private readonly ISupportProduitService _SupportProduitService;
        private readonly IFamilleProduitService _FamilleProduitService;
        private readonly ISocieteeService _societeeService;

        public LigneProspectionController(ILigneProspectionService ligneProspectionService ,
            IProspectService ProspectService,
            IstatutProspectionService statutProspectionService, 
            IProspectionServices prospectionServices,
        ISupportProduitService SupportProduitService,
        IFamilleProduitService FamilleProduitService,
        ISocieteeService SocieteeService)
        
        {
            _ligneProspectionService = ligneProspectionService;
            _ProspectService = ProspectService;
            _statutProspectionService = statutProspectionService;
            _prospectionServices = prospectionServices;
            _SupportProduitService = SupportProduitService;
            _FamilleProduitService = FamilleProduitService;
            _societeeService = SocieteeService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var ligneProspections = await _ligneProspectionService.GetAllAsync();
                foreach (var item in ligneProspections)
                {
                    if (item.StatutId.HasValue)
                    {
                        item.Statut = await _statutProspectionService.GetByIdAsync(item.StatutId.Value);
                    }

                    if (item.ProspectionId != Guid.Empty)
                    {
                        item.Prospection = await _prospectionServices.GetByIdAsync(item.ProspectionId);
                    }
                    if (item.FamilleProduitId != 0)
                    {
                        item.FamilleProduit = await _FamilleProduitService.GetByIdAsync(item.FamilleProduitId);
                    }
                    if (item.SupportProduitId.HasValue)
                    {
                        item.SupportProduit = await _SupportProduitService.GetByIdAsync(item.SupportProduitId.Value);
                    }
                    if (item.SocieteeId.HasValue)
                    {
                        item.Societee = await _societeeService.GetByIdAsync(item.SocieteeId.Value);

                    }

                }
                return Ok(ligneProspections);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

            [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var ligneProspection = await _ligneProspectionService.GetByIdAsync(id);
            if (ligneProspection == null)
                return NotFound();
            return Ok(ligneProspection);

        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] LigneProspectionUpdateDto ligneProspectionUpdateDto)
        {
            try
            {
                var ligneP = await _ligneProspectionService.GetByIdAsync(id);
                if (ligneP == null) return NotFound("Ligne Prospection not found.");
                ligneP.Designation = ligneProspectionUpdateDto.Designation;
                ligneP.FamilleProduitId = ligneProspectionUpdateDto.FamilleProduitId;
                ligneP.SupportProduitId = ligneProspectionUpdateDto.SupportProduitId;
                ligneP.ProspectionId = ligneProspectionUpdateDto.ProspectionId;
                ligneP.SocieteeId = ligneProspectionUpdateDto.SocieteeId;
                ligneP.StatutId = ligneProspectionUpdateDto.StatutId;
                ligneP.Date = ligneProspectionUpdateDto.Date;
                await _ligneProspectionService.UpdateAsync(ligneP);
                return Ok("Ligne Prospection updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LigneProspectionCreateDto ligneProspectionCreateDto)
        {
            try
            {
                if (ligneProspectionCreateDto == null)
                    return BadRequest("Ligne Prospection data is null.");
                if (ligneProspectionCreateDto.ProspectionId != Guid.Empty)
                {
                    var prospect = await _prospectionServices.GetByIdAsync(ligneProspectionCreateDto.ProspectionId);
                    if (prospect == null) return BadRequest("Invalid ProspectionId: Prospection not found.");
                }
                 var statut = await _statutProspectionService.GetByIdAsync(ligneProspectionCreateDto.StatutId);
                if  (statut == null) {return BadRequest("Invalid StatutId Not found  moush mawjoud."); }

                var supportProduit = await _SupportProduitService.GetByIdAsync(ligneProspectionCreateDto.SupportProduitId);
                if (supportProduit == null) { return BadRequest("Invalid SupportProduitId Not found  moush mawjoud."); }
                var familleProduit = await _FamilleProduitService.GetByIdAsync(ligneProspectionCreateDto.FamilleProduitId);
                if (familleProduit == null) { return BadRequest("Invalid FamilleProduitId Not found  moush mawjoud."); }
                var societee = await _societeeService.GetByIdAsync(ligneProspectionCreateDto.SocieteeId);
                if (societee == null) { return BadRequest("Invalid SocieteeId Not found  moush mawjoud."); }

                var ligneProspection = new LigneProspection
                {
                    Designation = ligneProspectionCreateDto.Designation,
                    
                    FamilleProduitId = ligneProspectionCreateDto.FamilleProduitId,
                    SupportProduitId = ligneProspectionCreateDto.SupportProduitId,
                    ProspectionId = ligneProspectionCreateDto.ProspectionId,
                    SocieteeId = ligneProspectionCreateDto.SocieteeId,
                    StatutId = ligneProspectionCreateDto.StatutId,
                    Date = ligneProspectionCreateDto.Date
                };
                
                await _ligneProspectionService.CreateAsync(ligneProspection);
                return Ok("ligneProspection  created successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
