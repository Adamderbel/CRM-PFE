using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "MANAGER,ADMIN")]
    public class PowerBiController : ControllerBase
    {
        private readonly IConfiguration _config;

        public PowerBiController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("embed-config")]
        public IActionResult GetEmbedConfig()
        {
            var groupId = _config["PowerBi:GroupId"] ?? string.Empty;
            var reportId = _config["PowerBi:ReportId"] ?? string.Empty;
            var embedUrl = _config["PowerBi:EmbedUrl"] ?? string.Empty;
            var configured = !string.IsNullOrWhiteSpace(groupId)
                && !string.IsNullOrWhiteSpace(reportId)
                && !string.IsNullOrWhiteSpace(embedUrl);

            return Ok(new
            {
                message = configured ? null : "Power BI is not configured yet.",
                embedUrl,
                groupId,
                reportId,
                configured,
                accessMode = "placeholder"
            });
        }

        [HttpGet("reports")]
        public IActionResult GetReports()
        {
            return Ok(Array.Empty<object>());
        }
    }
}
