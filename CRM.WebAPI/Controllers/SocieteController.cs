using CRM.Services.Societe;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SocieteController : ControllerBase
    {
        private readonly ISocieteeService _societeeService;

        public SocieteController(ISocieteeService societeeService)
        {
            _societeeService = societeeService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var societees = await _societeeService.GetAllAsync();
            return Ok(societees);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var societee = await _societeeService.GetByIdAsync(id);
            if (societee == null)
                return NotFound();
            return Ok(societee);

        }
    }
}
