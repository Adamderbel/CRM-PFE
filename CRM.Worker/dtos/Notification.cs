using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Worker.dtos
{
    public class Notification
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string? TypeNotification { get; set; }

        public string? Titre { get; set; }

        public string? Message { get; set; }

        public bool Lu { get; set; }

        public DateTime DateCreation { get; set; }
    }
}
