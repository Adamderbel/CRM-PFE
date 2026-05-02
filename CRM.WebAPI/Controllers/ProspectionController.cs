using CRM.Entities.Crm;
using CRM.Services;
using CRM.Services.prospections;
using CRM.Services.StatutPrespection;
using CRM.WebAPI.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProspectionController : ControllerBase
    {

        private readonly IProspectionServices _prospectionServices;
        private readonly IstatutProspectionService _statutProspectionService;
        private readonly IProspectService _prospectService;
        private readonly IUserService _userService;



        public ProspectionController(IUserService userService, IProspectionServices prospectionServices, IstatutProspectionService statutProspectionService, IProspectService prospectService)
        {
            _prospectionServices = prospectionServices;
            _statutProspectionService = statutProspectionService;
            _prospectService = prospectService;
            _userService = userService;

        }

        [HttpPost]
        public async Task<IActionResult> CreateProspection([FromBody] ProspectionCreateDto prospectionDto)
        {
            if (prospectionDto == null) return BadRequest("Prospection data is null.");

            try
            {
                if (prospectionDto.ProspectId.HasValue)
                {
                    var prospect = await _prospectService.GetByIdAsync(prospectionDto.ProspectId.Value);
                    if (prospect == null) return BadRequest("Invalid ProspectId: Prospect not found.");
                }

                var statut = await _statutProspectionService.GetByIdAsync(prospectionDto.StatutId);
                if (statut == null) return BadRequest($"Invalid StatutId: Statut with ID {prospectionDto.StatutId} not found.");
                if (prospectionDto.UserId.HasValue)
                {
                    var user = await _userService.GetByIdAsync(prospectionDto.UserId.Value);
                    if (user == null) return BadRequest("Invalid UserId: User not found.");
                }

                var pros = new Prospection
                {
                    
                    DateDebut = prospectionDto.DateDebut,
                    DateFin = prospectionDto.DateFin,
                    Notes = prospectionDto.Notes,
                    StatutId = prospectionDto.StatutId,
                    UserId = prospectionDto.UserId,
                    ProspectId = prospectionDto.ProspectId
                };
                await _prospectionServices.CreateAsync(pros);
                return Ok("Prospection created successfully.");
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
                var prospections = await _prospectionServices.GetAllAsync();
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
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var prospection = await _prospectionServices.GetByIdAsync(id);
                if (prospection == null) return NotFound();
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
                var prospections = await _prospectionServices.GetByProspectIdAsync(prospectId);
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var prospection = await _prospectionServices.GetByIdAsync(id);
                if (prospection == null) return NotFound();
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
                existingProspection.DateDebut = prospectionDto.DateDebut;
                existingProspection.DateFin = prospectionDto.DateFin;
                existingProspection.Notes = prospectionDto.Notes;
                existingProspection.StatutId = prospectionDto.StatutId;
                existingProspection.UserId = prospectionDto.UserId;
                existingProspection.ProspectId = prospectionDto.ProspectId;
                await _prospectionServices.UpdateAsync(existingProspection);
                return Ok("Prospection updated successfully.");
            }
            catch (Exception ex)
            {
                // Log the exception (not implemented here)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }  
}}
