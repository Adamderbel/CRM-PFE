using CRM.Services.FamilleProduits;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FamilleProduitController : ControllerBase
    {
        private readonly IFamilleProduitService _familleProduitService;

        public FamilleProduitController(IFamilleProduitService familleProduitService)
        {
            _familleProduitService = familleProduitService;
        }
        [HttpGet]   
        public async Task<IActionResult> GetAll()
        {
            var familleProduits = await _familleProduitService.GetAllAsync();
            return Ok(familleProduits);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var familleProduit = await _familleProduitService.GetByIdAsync(id);
            if (familleProduit == null)
                return NotFound();
            return Ok(familleProduit);
        }

    }
}
