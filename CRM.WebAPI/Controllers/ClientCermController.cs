using CRM.Entities.Common;
using CRM.Services.clientscerm;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientCermController : ControllerBase
    {
        private readonly IClientCermService _clientCermService;

        public ClientCermController(IClientCermService clientCermService)
        {
            _clientCermService = clientCermService;
        }

        [HttpGet("recherche")]
        public async Task<IActionResult> GetAll(
     [FromQuery] string? refClient,
     [FromQuery] string? nom,
     [FromQuery] int limit = 100)
        {
            try
            {
                // 🚫 Prevent loading all data when no search criteria
                if (string.IsNullOrWhiteSpace(refClient) && string.IsNullOrWhiteSpace(nom))
                {
                    return Ok(new List<ClientCerm>());
                }

                var clients = await _clientCermService.GetAllAsync();

                // 🔍 Filter by reference
                if (!string.IsNullOrWhiteSpace(refClient))
                {
                    clients = clients.Where(c =>
                        c.RefClient.ToString().Contains(refClient, StringComparison.OrdinalIgnoreCase)
                    );
                }

                // 🔍 Filter by name
                if (!string.IsNullOrWhiteSpace(nom))
                {
                    clients = clients.Where(c =>
                        c.Nom != null &&
                        c.Nom.Contains(nom, StringComparison.OrdinalIgnoreCase)
                    );
                }

                // 📉 Limit results
                var result = clients.Take(limit).ToList();

                return Ok(result);
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
            var clientCerm = await _clientCermService.GetByIdAsync(id);
            if (clientCerm == null)
            {
                return NotFound(new { message = $"Client Cerm with ID {id} not found." });
            }
            return Ok(clientCerm);

        }
    }
}
