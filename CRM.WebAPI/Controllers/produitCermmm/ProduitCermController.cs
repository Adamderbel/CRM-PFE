using CRM.Services.produitecerms;
using CRM.Entities.Common;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers.produitCermmm
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProduitCermController : ControllerBase
    {
        private readonly IproduitCermService _produitCermService;
        public ProduitCermController(IproduitCermService produitCermService)
        {
            _produitCermService = produitCermService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? refArt, [FromQuery] string? designation, [FromQuery] int limit = 100)
        {
            try
            {
                var produits = await _produitCermService.GetAllAsync();
                
                if (!string.IsNullOrWhiteSpace(refArt))
                {
                    produits = produits.Where(p => p.RefProduit.ToString().Contains(refArt, StringComparison.OrdinalIgnoreCase));
                }

                if (!string.IsNullOrWhiteSpace(designation))
                {
                    produits = produits.Where(p => p.Designation != null && p.Designation.Contains(designation, StringComparison.OrdinalIgnoreCase));
                }

                var limitedProduits = produits
                    .OrderBy(p => p.Designation)
                    .Take(Math.Clamp(limit, 1, 1000))
                    .ToList();
                
                return Ok(limitedProduits);
            }
            catch (Exception ex)
            {
                var innerMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { error = ex.Message, details = innerMessage });
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var produit = await _produitCermService.GetByIdAsync(id);
                if (produit == null)
                {
                    return NotFound(new { message = "Product not found" });
                }
                return Ok(produit);
            }
            catch (Exception ex)
            {
                var innerMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { error = ex.Message, details = innerMessage });
            }
        }
        [HttpGet("recherche")]
        public async Task<IActionResult> RechercheProduit([FromQuery] string? recherche)
        {
            try
            {
                // If neither search criteria is provided, return an empty list to avoid loading data on init
                if (string.IsNullOrWhiteSpace(recherche) )
                {
                    return Ok(new List<ProduitCerm>());
                }

                var produits = await _produitCermService.RechercherProduitCerm(recherche);

               

                return Ok(produits);
            }
            catch (Exception ex)
            {
                var innerMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { error = ex.Message, details = innerMessage });
            }
        }
    }
}
