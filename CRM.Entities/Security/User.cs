using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Entities.Security
{
    public class User
    {
        public Guid Id { get; set; }

        public string UserName { get; set; } = null!;
        public string NormalizedUserName { get; set; } = null!;

        public string Email { get; set; } = null!;
        public string NormalizedEmail { get; set; } = null!;

        public bool EmailConfirmed { get; set; }
        public string Nom { get; set; } = null!;
        public string Prenom { get; set; } = null!;

        public string PasswordHash { get; set; } = null!;

        public bool IsActive { get; set; }

    }
}
