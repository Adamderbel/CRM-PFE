using CRM.Services.CauseEchecs;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CauseEchecController : ControllerBase
    {
        private readonly ICauseEchecService _causeEchecService;

        public CauseEchecController(ICauseEchecService causeEchecService)
        {
            _causeEchecService = causeEchecService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var causeEchecs = await _causeEchecService.GetAllAsync();
            return Ok(causeEchecs);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var causeEchec = await _causeEchecService.GetByIdAsync(id);
            if (causeEchec == null)
                return NotFound();
            return Ok(causeEchec);

        }
    }

}
