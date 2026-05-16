using CRM.Services.notification;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // =========================
        // GET notifications by user
        // =========================
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(Guid userId)
        {
            var result = await _notificationService.GetByUserAsync(userId);
            return Ok(result);
        }

        // =========================
        // MARK AS READ
        // =========================
        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            await _notificationService.MarkAsReadAsync(id);
            return Ok(new
            {
                message = "Notification marquée comme lue"
            });
        }
    }
}