using CRM.Entities;
using CRM.Services.clientscerm;
using CRM.Services.produitecerms;
using CRM.Services.reclamations;
using CRM.WebAPI.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReclamationController : ControllerBase
    {
        private readonly IReclamationService _reclamationService;
        private readonly IproduitCermService _produitCermService;
        private readonly IClientCermService _clientCermService;

        public ReclamationController(IReclamationService reclamationService, IproduitCermService produitCermService, IClientCermService clientCermService)
        {
            _reclamationService = reclamationService;
            _produitCermService = produitCermService;
            _clientCermService = clientCermService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {  
                var reclamations = await _reclamationService.GetAllReclamations();
                foreach (var item in reclamations)
                {
                    item.Client = await _clientCermService.GetByIdAsync(item.ClientId);
                    item.Produit = await _produitCermService.GetByIdAsync(item.ProduitRef);
                }

                // Map to an anonymous object (or a dedicated DTO) to prevent JSON circular reference loops
                var result = reclamations.Select(r => new ReclamationDtoCreate
                {

                    Titre = r.Titre,
                    Description = r.Description,
                    Statut = r.Statut,
                    Priorite = r.Priorite,
                    Source = r.Source,
                    NumeroReference = r.NumeroReference,
                    ClientId = r.ClientId,
                    NomClient = r.Client?.Nom,
                    ProduitId = r.ProduitRef,
                    DesignationProduit = r.Produit?.Designation,
                    ResponsableId = r.ResponsableId


                });

                return Ok(result);

            
           
        }

        [HttpPost]
        public async Task<IActionResult> CreateReclamation([FromBody] ReclamationDtoCreate reclamation)
        {
            try
            {
                
                var client = await _clientCermService.GetByIdAsync(reclamation.ClientId);
                if (client == null)
                {
                    return BadRequest(new { error = "Client not found." });
                }
              
                var produit = await _produitCermService.GetByIdAsync(reclamation.ProduitId);
                if (produit == null)
                {
                    return BadRequest(new { error = "Produit not found." });
                }

                
                var newReclamation = new Reclamation
                { 
                    Id = Guid.NewGuid(),
                    Titre = reclamation.Titre,
                    Description = reclamation.Description,
                    Statut = reclamation.Statut,
                    Priorite = reclamation.Priorite,
                    Source = reclamation.Source,
                    NumeroReference = reclamation.NumeroReference,
                    ClientId = reclamation.ClientId,
                    ProduitRef = reclamation.ProduitId,
                    ResponsableId = reclamation.ResponsableId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                
                await _reclamationService.AddReclamation(newReclamation);
                return Ok(new { message = "Reclamation created successfully." });
            }
            catch (Exception ex)
            {
                var innerMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { error = ex.Message, details = innerMessage });
            }
        }
    }
}
