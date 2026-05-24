using CRM.Services;
using CRM.Services.LigneProspections;
using CRM.Services.prospections;
using CRM.Services.StatutPrespection;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IProspectionServices _prospectionServices;
        private readonly ILigneProspectionService _ligneProspectionService;
        private readonly IstatutProspectionService _statutProspectionService;
        private readonly IProspectService _prospectService;

        public DashboardController(
            IProspectionServices prospectionServices,
            ILigneProspectionService ligneProspectionService,
            IstatutProspectionService statutProspectionService,
            IProspectService prospectService)
        {
            _prospectionServices = prospectionServices;
            _ligneProspectionService = ligneProspectionService;
            _statutProspectionService = statutProspectionService;
            _prospectService = prospectService;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var prospections = (await _prospectionServices.GetAllAsync()).ToList();
                var lignes = (await _ligneProspectionService.GetAllAsync()).ToList();
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
    }
}
