using CRM.Services.commandeService;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/commandes")]
    public class CommandesController : ControllerBase
    {
        private readonly ICommandeService _commandeService;

        public CommandesController(ICommandeService commandeService)
        {
            _commandeService = commandeService;
        }

        // =========================
        // GET commande by ref
        // =========================
        [HttpGet("{refCommande}")]
        public async Task<IActionResult> GetCommande(string refCommande)
        {
            var result = await _commandeService.GetCommandeAsync(refCommande);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // =========================
        // GET commandes by client
        // =========================
        [HttpGet("client/{clientId}")]
        public async Task<IActionResult> GetByClient(string clientId)
        {
            var result = await _commandeService.GetCommandesByClientAsync(clientId);

            return Ok(result);
        }

        // =========================
        // GET lignes by commande
        // =========================
        [HttpGet("{refCommande}/lignes")]
        public async Task<IActionResult> GetLignes(string refCommande)
        {
            var result = await _commandeService.GetLignesCommandeByRefAsync(refCommande);

            return Ok(result);
        }

        // =========================
        // GET full detail (commande + lignes)
        // (très bon pour PFE)
        // =========================
        [HttpGet("{refCommande}/details")]
        public async Task<IActionResult> GetDetails(string refCommande)
        {
            var commande = await _commandeService.GetCommandeAsync(refCommande);

            if (commande == null)
                return NotFound();

            var lignes = await _commandeService.GetLignesCommandeByRefAsync(refCommande);

            return Ok(new
            {
                commande,
                lignes
            });
        }
    }
}