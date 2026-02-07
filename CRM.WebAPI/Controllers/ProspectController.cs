using CRM.Entities.Crm;
using CRM.Services;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProspectController : ControllerBase
    {
        private readonly IProspectService _prospectService;

        public ProspectController(IProspectService prospectService)
        {
            _prospectService = prospectService;
        }

        // GET: api/prospect
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var prospects = await _prospectService.GetAllAsync();
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
        public async Task<IActionResult> GetById(int id)
        {
            var prospect = await _prospectService.GetByIdAsync(id);

            if (prospect == null)
                return NotFound();

            return Ok(prospect);
        }

        // POST: api/prospect
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Prospect prospect)
        {
            if (prospect == null)
                return BadRequest();

            await _prospectService.CreateAsync(prospect);
            return Ok();
        }

        // PUT: api/prospect
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Prospect prospect)
        {
            if (prospect == null || prospect.Id == 0)
                return BadRequest();

            await _prospectService.UpdateAsync(prospect);
            return Ok();
        }

        // DELETE: api/prospect/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _prospectService.DeleteAsync(id);
            return Ok();
        }
    }
}