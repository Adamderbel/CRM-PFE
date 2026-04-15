using CRM.Services.StatutPrespection;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatutProspectionController : ControllerBase
    {
        private readonly IstatutProspectionService _statutProspectionService;

        public StatutProspectionController(IstatutProspectionService statutProspectionService)
        {
            _statutProspectionService = statutProspectionService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var statutProspections = await _statutProspectionService.GetAllAsync();
                return Ok(statutProspections);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var statutProspection = await _statutProspectionService.GetByIdAsync(id);
                if (statutProspection == null)
                    return NotFound();
                return Ok(statutProspection);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
