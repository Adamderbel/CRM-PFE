using CRM.Entities;
using CRM.Entities.Common;
using CRM.Entities.Security;
using CRM.Services.clientscerm;
using CRM.Services.notification;
using CRM.Services.produitecerms;
using CRM.Services.reclamations;
using CRM.WebAPI.DTOs;
using Microsoft.AspNetCore.Identity;
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
                var reclamations = await _reclamationService.GetAllReclamations();
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
            var all = await _reclamationService.GetAllReclamations();
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
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                
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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReclamation(Guid id, [FromBody] ReclamationDtoCreate reclamation)
        {
            try
            {
                var existingReclamation = await _reclamationService.GetReclamationById(id);
                if (existingReclamation == null)
                {
                    return NotFound(new { error = "Reclamation not found." });
                }

                existingReclamation.AnalyseReclamation = reclamation.AnalyseReclamation;
                existingReclamation.Justifiee = reclamation.Justifiee;
                existingReclamation.CommentaireJustification = reclamation.CommentaireJustification;
                existingReclamation.Statut = reclamation.Statut; // Should pass 'En cours', 'En execution', 'Controle'
                if (reclamation.DateExecution.HasValue)
                {
                    existingReclamation.DateExecution = reclamation.DateExecution;
                }
                if (reclamation.DateControleExecution.HasValue)
                {
                    existingReclamation.DateControleExecution = reclamation.DateControleExecution;
                }
                existingReclamation.CommentaireControleExecution = reclamation.CommentaireControleExecution;

                if (reclamation.DateClotureReclamation.HasValue)
                {
                    existingReclamation.DateClotureReclamation = reclamation.DateClotureReclamation;
                }
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
    }
}
