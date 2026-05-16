using CRM.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.notification
{
    public interface INotificationService
    {
        Task<List<Notification>> GetByUserAsync(Guid userId);

        Task MarkAsReadAsync(Guid notificationId);
    }
}
