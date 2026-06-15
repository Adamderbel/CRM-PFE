using CRM.Entities;
using CRM.Entities.Common;
using CRM.Entities.Security;
using CRM.Services.clientscerm;
using CRM.Services.notification;
using CRM.Services.produitecerms;
using CRM.Services.reclamations;
using CRM.WebAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "COMMERCIAL,MANAGER,ADMIN")]
    public class ReclamationController : ControllerBase
    {
        private static readonly HashSet<string> AllowedStatuses = new(StringComparer.OrdinalIgnoreCase)
        {
            "Nouveau",
            "Ouverte",
            "En cours",
            "En attente",
            "En attente client",
            "Résolu",
            "Clôturé"
        };

        private readonly IReclamationService _reclamationService;
        private readonly IproduitCermService _produitCermService;
        private readonly IClientCermService _clientCermService;
        private readonly INotificationService _notificationService;
        private readonly UserManager<SecUser> _userManager;

        public ReclamationController(
            IReclamationService reclamationService,
            IproduitCermService produitCermService,
            IClientCermService clientCermService,
            INotificationService notificationService,
            UserManager<SecUser> userManager)
        {
            _reclamationService = reclamationService;
            _produitCermService = produitCermService;
            _clientCermService = clientCermService;
            _notificationService = notificationService;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {  
                var principal = await ResolveCurrentSecUserAsync(User);
                var reclamations = await _reclamationService.GetAllReclamations(principal?.Id, GetCurrentRole());
                foreach (var item in reclamations)
                {
                    item.Client = await _clientCermService.GetByIdAsync(item.ClientId);
                    item.Produit = await _produitCermService.GetByIdAsync(item.ProduitRef);
                }

                // Map to an anonymous object (or a dedicated DTO) to prevent JSON circular reference loops
                var result = reclamations.Select(r => new ReclamationDtoCreate
                {
                    Id = r.Id,
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
                    AnalyseReclamation = r.AnalyseReclamation,
                    Justifiee = r.Justifiee,
                    CommentaireJustification = r.CommentaireJustification,
                    DateExecution = r.DateExecution,
                    DateControleExecution = r.DateControleExecution,
                    CommentaireControleExecution = r.CommentaireControleExecution,
                    DateClotureReclamation = r.DateClotureReclamation,
                    Rapport = r.Rapport,
                    ResponsableFaute = r.ResponsableFaute,
                    Degats = r.Degats,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                });

                return Ok(result);

            
           
        }

        [HttpGet("client/{clientId}")]
        public async Task<IActionResult> GetByClient(int clientId)
        {
            try
            {
            var principal = await ResolveCurrentSecUserAsync(User);
            var all = await _reclamationService.GetAllReclamations(principal?.Id, GetCurrentRole());
            var filtered = all.Where(r => r.ClientId == clientId).ToList();

            foreach (var item in filtered)
            {
                item.Client = await _clientCermService.GetByIdAsync(item.ClientId);
                item.Produit = await _produitCermService.GetByIdAsync(item.ProduitRef);
            }

            var result = filtered.Select(r => new ReclamationDtoCreate
            {
                Id = r.Id,
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
                AnalyseReclamation = r.AnalyseReclamation,
                Justifiee = r.Justifiee,
                CommentaireJustification = r.CommentaireJustification,
                DateExecution = r.DateExecution,
                DateControleExecution = r.DateControleExecution,
                CommentaireControleExecution = r.CommentaireControleExecution,
                DateClotureReclamation = r.DateClotureReclamation,
                Rapport = r.Rapport,
                ResponsableFaute = r.ResponsableFaute,
                Degats = r.Degats,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt
            });

            return Ok(result);
            }
            catch (Exception ex)
            {
                var inner = ex.InnerException?.Message ?? "";
                return StatusCode(500, new { error = ex.Message, details = inner });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var reclamation = await _reclamationService.GetReclamationById(id);
                if (reclamation == null)
                    return NotFound(new { error = "Reclamation not found." });

                reclamation.Client = await _clientCermService.GetByIdAsync(reclamation.ClientId);
                reclamation.Produit = await _produitCermService.GetByIdAsync(reclamation.ProduitRef);

                var dto = new ReclamationDtoCreate
                {
                    Id = reclamation.Id,
                    Titre = reclamation.Titre,
                    Description = reclamation.Description,
                    Statut = reclamation.Statut,
                    Priorite = reclamation.Priorite,
                    Source = reclamation.Source,
                    NumeroReference = reclamation.NumeroReference,
                    ClientId = reclamation.ClientId,
                    NomClient = reclamation.Client?.Nom,
                    ProduitId = reclamation.ProduitRef,
                    DesignationProduit = reclamation.Produit?.Designation,
                    AnalyseReclamation = reclamation.AnalyseReclamation,
                    Justifiee = reclamation.Justifiee,
                    CommentaireJustification = reclamation.CommentaireJustification,
                    DateExecution = reclamation.DateExecution,
                    DateControleExecution = reclamation.DateControleExecution,
                    CommentaireControleExecution = reclamation.CommentaireControleExecution,
                    DateClotureReclamation = reclamation.DateClotureReclamation,
                    Rapport = reclamation.Rapport,
                    ResponsableFaute = reclamation.ResponsableFaute,
                    Degats = reclamation.Degats,
                    CreatedAt = reclamation.CreatedAt,
                    UpdatedAt = reclamation.UpdatedAt
                };

                return Ok(dto);
            }
            catch (Exception ex)
            {
                var inner = ex.InnerException?.Message ?? "";
                return StatusCode(500, new { error = ex.Message, details = inner });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateReclamation([FromBody] ReclamationDtoCreate reclamation)
        {
            try
            {
                if (!IsValidStatus(reclamation.Statut))
                    return BadRequest(new { error = "Statut de réclamation invalide." });

                var principal = await ResolveCurrentSecUserAsync(User);
                if (principal == null)
                    return Unauthorized();

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

                
                // Auto-generate reference number
                var numeroReference = await _reclamationService.GetNextReferenceAsync();

                var newReclamation = new Reclamation
                { 
                    Id = Guid.NewGuid(),
                    Titre = reclamation.Titre,
                    Description = reclamation.Description,
                    Statut = reclamation.Statut,
                    Priorite = reclamation.Priorite,
                    Source = reclamation.Source,
                    NumeroReference = numeroReference,
                    ClientId = reclamation.ClientId,
                    ProduitRef = reclamation.ProduitId,
                    CommercialId = principal.Id,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                if (IsClosedStatus(newReclamation.Statut))
                    newReclamation.DateClotureReclamation = DateTime.UtcNow;

                
                await _reclamationService.AddReclamation(newReclamation);

                // Notify all commerciaux that a new client reclamation has been filed
                try
                {
                    var commerciaux = await _userManager.GetUsersInRoleAsync("COMMERCIAL");
                    if (commerciaux.Count > 0)
                    {
                        var clientName = client.Nom ?? $"Client #{client.RefClient}";
                        var produitName = produit.Designation ?? $"Produit #{produit.RefProduit}";
                        var titre = "Nouvelle réclamation";
                        var message = $"{clientName} a déposé une réclamation sur {produitName}.";

                        var notifs = commerciaux.Select(u => new Notification
                        {
                            UserId = u.Id,
                            TypeNotification = "RECLAMATION",
                            Titre = titre,
                            Message = message,
                            Lu = false,
                            DateCreation = DateTime.UtcNow
                        });

                        await _notificationService.CreateManyAsync(notifs);
                    }
                }
                catch (Exception notifEx)
                {
                    // Don't fail the reclamation if notifications crash — just log it
                    Console.WriteLine($"[Notification] Failed to notify commerciaux: {notifEx.Message}");
                }

                return Ok(new { message = "Reclamation created successfully." });
            }
            catch (Exception ex)
            {
                var innerMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { error = ex.Message, details = innerMessage });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReclamation(Guid id)
        {
            try
            {
                var reclamation = await _reclamationService.GetReclamationById(id);
                if (reclamation == null)
                    return NotFound(new { error = "Reclamation not found." });

                var principal = await ResolveCurrentSecUserAsync(User);
                if (principal == null)
                    return Unauthorized();

                if (IsCommercial() && reclamation.CommercialId != principal.Id)
                    return NotFound(new { error = "Reclamation not found." });

                await _reclamationService.DeleteReclamation(id);
                return Ok(new { message = "Reclamation deleted successfully." });
            }
            catch (Exception ex)
            {
                var innerMessage = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { error = "Unable to delete reclamation.", details = innerMessage });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReclamation(Guid id, [FromBody] ReclamationDtoCreate reclamation)
        {
            try
            {
                if (!IsValidStatus(reclamation.Statut))
                    return BadRequest(new { error = "Statut de réclamation invalide." });

                var existingReclamation = await _reclamationService.GetReclamationById(id);
                if (existingReclamation == null)
                {
                    return NotFound(new { error = "Reclamation not found." });
                }
                var principal = await ResolveCurrentSecUserAsync(User);
                if (IsCommercial() && existingReclamation.CommercialId != principal?.Id)
                {
                    return NotFound(new { error = "Reclamation not found." });
                }

                existingReclamation.AnalyseReclamation = reclamation.AnalyseReclamation;
                existingReclamation.Justifiee = reclamation.Justifiee;
                existingReclamation.CommentaireJustification = reclamation.CommentaireJustification;
                existingReclamation.Statut = reclamation.Statut;
                if (reclamation.DateExecution.HasValue)
                {
                    existingReclamation.DateExecution = reclamation.DateExecution;
                }
                if (reclamation.DateControleExecution.HasValue)
                {
                    existingReclamation.DateControleExecution = reclamation.DateControleExecution;
                }
                existingReclamation.CommentaireControleExecution = reclamation.CommentaireControleExecution;

                existingReclamation.DateClotureReclamation = IsClosedStatus(reclamation.Statut)
                    ? reclamation.DateClotureReclamation ?? existingReclamation.DateClotureReclamation ?? DateTime.UtcNow
                    : null;
                existingReclamation.Rapport = reclamation.Rapport;
                existingReclamation.ResponsableFaute = reclamation.ResponsableFaute;
                existingReclamation.Degats = reclamation.Degats;

                existingReclamation.UpdatedAt = DateTime.UtcNow;

                await _reclamationService.UpdateReclamation(id, existingReclamation);
                return Ok(new { message = "Reclamation updated successfully." });
            }
            catch (Exception ex)
            {
                var innerMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { error = ex.Message, details = innerMessage, stack = ex.StackTrace });
            }
        }

        private string? GetCurrentRole()
            => User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role || c.Type.EndsWith("/role", StringComparison.OrdinalIgnoreCase))?.Value;

        private bool IsCommercial()
            => string.Equals(GetCurrentRole(), "COMMERCIAL", StringComparison.OrdinalIgnoreCase)
            || string.Equals(GetCurrentRole(), "Commercial", StringComparison.OrdinalIgnoreCase);

        private static bool IsValidStatus(string? status)
            => !string.IsNullOrWhiteSpace(status) && AllowedStatuses.Contains(status.Trim());

        private static bool IsClosedStatus(string? status)
            => string.Equals(status?.Trim(), "Clôturé", StringComparison.OrdinalIgnoreCase)
            || string.Equals(status?.Trim(), "Résolu", StringComparison.OrdinalIgnoreCase);

        private async Task<SecUser?> ResolveCurrentSecUserAsync(ClaimsPrincipal claimsPrincipal)
        {
            var user = await _userManager.GetUserAsync(claimsPrincipal);
            if (user != null)
                return user;

            var idStr = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? claimsPrincipal.FindFirstValue(JwtRegisteredClaimNames.Sub)
                ?? claimsPrincipal.FindFirstValue("sub");

            return Guid.TryParse(idStr, out var id)
                ? await _userManager.FindByIdAsync(id.ToString())
                : null;
        }
    }
}
