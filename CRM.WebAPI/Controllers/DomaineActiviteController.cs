using CRM.Services;
using Microsoft.AspNetCore.Mvc;



namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DomaineActiviteController : ControllerBase
    {
        private readonly IDomaineActiviteService _domaineActiviteService;

        public DomaineActiviteController(IDomaineActiviteService domaineActiviteService)
        {
            _domaineActiviteService = domaineActiviteService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var domaines = await _domaineActiviteService.GetAllAsync();
            return Ok(domaines);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var domaine = await _domaineActiviteService.GetByIdAsync(id);

            if (domaine == null)
                return NotFound();

            return Ok(domaine);
        }
    }
}
