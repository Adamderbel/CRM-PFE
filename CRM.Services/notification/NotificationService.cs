using CRM.DAL.DBContexts;
using CRM.Entities.Common;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.notification
{
    public class NotificationService : INotificationService
    {
        private readonly DataContext _context;

        public NotificationService(DataContext context)
        {
            _context = context;
        }


        public async Task<List<Notification>> GetByUserAsync(Guid userId)
        {
            return await _context.Set<Notification>()
                .AsNoTracking()
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.DateCreation)
                .ToListAsync();
        }

        public async Task MarkAsReadAsync(Guid notificationId)
        {
            var notif = await _context.Set<Notification>()
                .FirstOrDefaultAsync(x => x.Id == notificationId);

            if (notif == null)
                return;

            notif.Lu = true;
            await _context.SaveChangesAsync();
        }

        public async Task CreateAsync(Notification notification)
        {
            if (notification.Id == Guid.Empty) notification.Id = Guid.NewGuid();
            if (notification.DateCreation == default) notification.DateCreation = DateTime.UtcNow;
            _context.Set<Notification>().Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task CreateManyAsync(IEnumerable<Notification> notifications)
        {
            var list = notifications.ToList();
            foreach (var n in list)
            {
                if (n.Id == Guid.Empty) n.Id = Guid.NewGuid();
                if (n.DateCreation == default) n.DateCreation = DateTime.UtcNow;
            }
            _context.Set<Notification>().AddRange(list);
            await _context.SaveChangesAsync();
        }
    }
}

