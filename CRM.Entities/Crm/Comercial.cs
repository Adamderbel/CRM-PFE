using CRM.Entities.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Entities.Crm
{
    public class Comercial:User
    {
        public string Nom { get; set; }
        public string Prenom { get; set; }
    }
}
