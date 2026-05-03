using CRM.Entities.Crm;
using CRM.Services.ActionProspection;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActionsProspectionController : ControllerBase
    {
        private readonly IActionProspectionService _service;

        public ActionsProspectionController(IActionProspectionService service)
        {
            _service = service;
        }

        [HttpGet("prospection/{prospectionId}")]
        public async Task<ActionResult<IEnumerable<ActionsProspection>>> GetByProspectionId(Guid prospectionId)
        {
            var result = await _service.GetByProspectionIdAsync(prospectionId);
            return Ok(result);
        }

        [HttpGet("ligne/{ligneId}")]
        public async Task<ActionResult<IEnumerable<ActionsProspection>>> GetByLigneProspectionId(Guid ligneId)
        {
            var result = await _service.GetByLigneProspectionIdAsync(ligneId);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ActionsProspection>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("last/{prospectionId}")]
        public async Task<ActionResult<ActionsProspection>> GetLastAction(Guid prospectionId)
        {
            var result = await _service.GetLastActionAsync(prospectionId);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(ActionsProspection action)
        {
            await _service.AddAsync(action);
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Update(ActionsProspection action)
        {
            await _service.UpdateAsync(action);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return Ok();
        }
    }
}