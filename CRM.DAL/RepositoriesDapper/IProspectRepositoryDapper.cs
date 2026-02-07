using CRM.Entities.Crm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.DAL.RepositoriesDupper
{
    public interface IProspectRepositoryDapper
    {
        public Task<IEnumerable<Prospect>> GetAllProspect();
    }
}
