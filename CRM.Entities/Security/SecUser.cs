using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;


namespace CRM.Entities.Security
{
    public class SecUser: IdentityUser<Guid>
    {
        public bool IsActive { get; set; }
        public string Nom { get; set; } = null!;
        public string Prenom { get; set; } = null!;
    }
}
