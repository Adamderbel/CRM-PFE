using CRM.Entities.Common;
using CRM.Entities.Crm;
using CRM.Services;
using CRM.WebAPI.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProspectController : ControllerBase
    {
        private readonly IProspectService _prospectService;
        private readonly IDomaineActiviteService _domaineActiviteService;

        public ProspectController(IProspectService prospectService, IDomaineActiviteService domaineActiviteService)
        {
            _prospectService = prospectService;
            _domaineActiviteService = domaineActiviteService;
        }

        // GET: api/prospect
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var prospects = await _prospectService.GetAllAsync();
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
            var prospects = await _prospectService.GetAllAsyncDapper();
            return Ok(prospects);
        }

        // GET: api/prospect/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            Prospect prospect = await _prospectService.GetByIdAsync(id);
           
            if (prospect == null)
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

                var domaine = await _domaineActiviteService.GetByIdAsync(prospectDto.idDomaineActivitee);

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
                    idDomaineActivitee = prospectDto.idDomaineActivitee
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
            existingProspect.idDomaineActivitee = dto.idDomaineActivitee;

            await _prospectService.UpdateAsync(existingProspect);

            return NoContent(); // 204 (better than Ok)
        }

        // DELETE: api/prospect/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _prospectService.DeleteAsync(id);
            return Ok();
        }

    }
}