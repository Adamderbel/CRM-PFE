using CRM.Services.SupportProduits;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupportProduitController : ControllerBase
    {
        private readonly ISupportProduitService _supportProduitService;
       public SupportProduitController(ISupportProduitService supportProduitService)
        {
            _supportProduitService = supportProduitService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var supportProduits = await _supportProduitService.GetAllAsync();
            return Ok(supportProduits);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var supportProduit = await _supportProduitService.GetByIdAsync(id);
            if (supportProduit == null)
                return NotFound();
            return Ok(supportProduit);
        }
    }


}
