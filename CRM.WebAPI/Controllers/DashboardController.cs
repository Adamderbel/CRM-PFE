using CRM.Entities.Security;
using CRM.Services;
using CRM.Services.clientscerm;
using CRM.Services.LigneProspections;
using CRM.Services.produitecerms;
using CRM.Services.prospections;
using CRM.Services.reclamations;
using CRM.Services.StatutPrespection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CRM.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "COMMERCIAL,MANAGER,ADMIN")]
    public class DashboardController : ControllerBase
    {
        private readonly IProspectionServices _prospectionServices;
        private readonly ILigneProspectionService _ligneProspectionService;
        private readonly IstatutProspectionService _statutProspectionService;
        private readonly IProspectService _prospectService;
        private readonly IClientCermService _clientCermService;
        private readonly IReclamationService _reclamationService;
        private readonly IproduitCermService _produitCermService;
        private readonly UserManager<SecUser> _userManager;

        public DashboardController(
            IProspectionServices prospectionServices,
            ILigneProspectionService ligneProspectionService,
            IstatutProspectionService statutProspectionService,
            IProspectService prospectService,
            IClientCermService clientCermService,
            IReclamationService reclamationService,
            IproduitCermService produitCermService,
            UserManager<SecUser> userManager)
        {
            _prospectionServices = prospectionServices;
            _ligneProspectionService = ligneProspectionService;
            _statutProspectionService = statutProspectionService;
            _prospectService = prospectService;
            _clientCermService = clientCermService;
            _reclamationService = reclamationService;
            _produitCermService = produitCermService;
            _userManager = userManager;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var principal = await ResolveCurrentSecUserAsync(User);
                var role = GetCurrentRole();
                var prospections = (await _prospectionServices.GetAllAsync(principal?.Id, role)).ToList();
                var lignes = (await _ligneProspectionService.GetAllAsync(principal?.Id, role)).ToList();
                var statuts = (await _statutProspectionService.GetAllAsync()).ToList();

                int total = prospections.Count;
                var lignesGagnees = new HashSet<Guid>(
                    lignes.Where(l => l.Concretisee == true).Select(l => l.ProspectionId));
                int gagnees = prospections.Count(p =>
                    p.StatutId == 5 || lignesGagnees.Contains(p.Id));
                int enCours = prospections.Count(p =>
                    p.StatutId != 5 && p.StatutId != 6 && !lignesGagnees.Contains(p.Id));
                double tauxConversion = total > 0 ? Math.Round((double)gagnees / total * 100, 1) : 0;

                var prospectionsByStatus = statuts.Select(s => new
                {
                    statutId = s.Id,
                    libelle = s.Libelle,
                    count = prospections.Count(p => p.StatutId == s.Id)
                }).ToList();

                var lignesByStatus = statuts.Select(s => new
                {
                    statutId = s.Id,
                    libelle = s.Libelle,
                    count = lignes.Count(l => l.StatutId == s.Id)
                }).Where(x => x.count > 0).ToList();

                var currentYear = DateTime.Now.Year;
                var culture = new System.Globalization.CultureInfo("fr-FR");
                var monthlyTrend = Enumerable.Range(1, 12).Select(m => new
                {
                    month = new DateTime(currentYear, m, 1).ToString("MMM", culture),
                    count = prospections.Count(p =>
                        (p.StatutId == 5 || lignesGagnees.Contains(p.Id)) &&
                        p.DateDebut.HasValue &&
                        p.DateDebut.Value.Year == currentYear &&
                        p.DateDebut.Value.Month == m)
                }).ToList();

                var recent = prospections
                    .OrderByDescending(p => p.DateDebut ?? DateTime.MinValue)
                    .Take(5)
                    .ToList();

                var recentProspections = new List<object>();
                foreach (var p in recent)
                {
                    var statut = statuts.FirstOrDefault(s => s.Id == p.StatutId);
                    string prospectName = "-";
                    if (p.ProspectId.HasValue)
                    {
                        var prospect = await _prospectService.GetByIdAsync(p.ProspectId.Value);
                        if (prospect != null)
                            prospectName = $"{prospect.Prenom} {prospect.Nom}".Trim();
                    }
                    recentProspections.Add(new
                    {
                        id = p.Id,
                        prospect = prospectName,
                        statut = statut?.Libelle ?? "Inconnu",
                        statutId = p.StatutId,
                        dateDebut = p.DateDebut?.ToString("dd/MM/yyyy"),
                        dateFin = p.DateFin?.ToString("dd/MM/yyyy"),
                    });
                }

                return Ok(new
                {
                    totalProspections = total,
                    prospectionsGagnees = gagnees,
                    tauxConversion,
                    prospectionsEnCours = enCours,
                    prospectionsByStatus,
                    lignesByStatus,
                    monthlyTrend,
                    recentProspections
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("metrics")]
        public async Task<IActionResult> GetMetrics()
        {
            try
            {
                var principal = await ResolveCurrentSecUserAsync(User);
                var role = GetCurrentRole();
                var prospects = (await _prospectService.GetAllAsync(principal?.Id, role)).ToList();
                var clients = (await _clientCermService.GetAllAsync()).ToList();
                var prospections = (await _prospectionServices.GetAllAsync(principal?.Id, role)).ToList();
                var lignes = (await _ligneProspectionService.GetAllAsync(principal?.Id, role)).ToList();
                var reclamations = (await _reclamationService.GetAllReclamations(principal?.Id, role)).ToList();

                var lignesGagnees = new HashSet<Guid>(lignes.Where(l => l.Concretisee).Select(l => l.ProspectionId));
                var gagnees = prospections.Count(p => p.StatutId == 5 || lignesGagnees.Contains(p.Id));
                var tauxConversion = prospections.Count > 0
                    ? Math.Round((double)gagnees / prospections.Count * 100, 1)
                    : 0;

                var now = DateTime.Now;
                return Ok(new
                {
                    totalProspects = prospects.Count,
                    totalClients = clients.Count,
                    totalProspections = prospections.Count,
                    totalLignesProspection = lignes.Count,
                    totalActionsCommerciales = 0,
                    totalReclamations = reclamations.Count,
                    tauxConversion,
                    nouveauxProspectsMois = prospects.Count(p => p.DateCreation.HasValue && p.DateCreation.Value.Year == now.Year && p.DateCreation.Value.Month == now.Month),
                    prospectionsEnCours = prospections.Count(p => p.StatutId != 5 && p.StatutId != 6 && !lignesGagnees.Contains(p.Id))
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("historique-commercial")]
        public async Task<IActionResult> GetHistoriqueCommercial([FromQuery] int limit = 120)
        {
            try
            {
                var principal = await ResolveCurrentSecUserAsync(User);
                var role = GetCurrentRole();
                var prospections = (await _prospectionServices.GetAllAsync(principal?.Id, role))
                    .OrderByDescending(p => p.DateDebut ?? DateTime.MinValue)
                    .Take(Math.Clamp(limit, 1, 500))
                    .ToList();

                var result = new List<object>();
                foreach (var p in prospections)
                {
                    string? prospectName = null;
                    if (p.ProspectId.HasValue)
                    {
                        var prospect = await _prospectService.GetByIdAsync(p.ProspectId.Value);
                        prospectName = $"{prospect?.Prenom} {prospect?.Nom}".Trim();
                    }
                    else if (p.ClientId.HasValue)
                    {
                        var client = await _clientCermService.GetByIdAsync(p.ClientId.Value);
                        prospectName = client?.Nom;
                    }

                    result.Add(new
                    {
                        actionId = p.Id,
                        dateAction = p.DateDebut,
                        typeActionLibelle = "Prospection",
                        prospectionId = p.Id,
                        prospectNomComplet = string.IsNullOrWhiteSpace(prospectName) ? null : prospectName,
                        commentaire = p.Notes,
                        resultat = p.StatutId?.ToString(),
                        ligneProspectionId = (string?)null
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("admin-stats")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> GetAdminStats()
        {
            try
            {
                var prospections = (await _prospectionServices.GetAllAsync()).ToList();
                var reclamations = (await _reclamationService.GetAllReclamations()).ToList();

                // C. Réclamations par statut
                var reclamationsByStatut = reclamations
                    .GroupBy(r => string.IsNullOrWhiteSpace(r.Statut) ? "Inconnu" : r.Statut!.Trim())
                    .Select(g => new { statut = g.Key, count = g.Count() })
                    .OrderByDescending(x => x.count)
                    .ToList();

                // D. Tendance globale — toutes les prospections par mois (année courante)
                var currentYear = DateTime.Now.Year;
                var culture = new System.Globalization.CultureInfo("fr-FR");
                var monthlyProspections = Enumerable.Range(1, 12).Select(m => new
                {
                    month = new DateTime(currentYear, m, 1).ToString("MMM", culture),
                    count = prospections.Count(p =>
                        p.DateDebut.HasValue &&
                        p.DateDebut.Value.Year == currentYear &&
                        p.DateDebut.Value.Month == m)
                }).ToList();

                // E. Top produits réclamés (top 5)
                var topGroups = reclamations
                    .GroupBy(r => r.ProduitRef)
                    .Select(g => new { produitRef = g.Key, count = g.Count() })
                    .OrderByDescending(x => x.count)
                    .Take(5)
                    .ToList();

                var topProduitsReclames = new List<object>();
                foreach (var g in topGroups)
                {
                    var produit = await _produitCermService.GetByIdAsync(g.produitRef);
                    topProduitsReclames.Add(new
                    {
                        produit = produit?.Designation ?? $"Produit #{g.produitRef}",
                        count = g.count
                    });
                }

                return Ok(new
                {
                    reclamationsByStatut,
                    monthlyProspections,
                    topProduitsReclames
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // Users grouped by role
        [HttpGet("users-by-role")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetUsersByRole()
        {
            try
            {
                var roles = new[] { "ADMIN", "MANAGER", "COMMERCIAL" };
                var result = new List<object>();
                foreach (var role in roles)
                {
                    var users = await _userManager.GetUsersInRoleAsync(role);
                    result.Add(new { role, count = users.Count });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        private string? GetCurrentRole()
            => User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role || c.Type.EndsWith("/role", StringComparison.OrdinalIgnoreCase))?.Value;

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
