using CRM.DAL.GenericRepository;
using CRM.DAL.RepositoriesDupper;
using CRM.Entities.Crm;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.DAL.RepositoriesDapper
{
    public class ProspectRepositoryDapper : RepositoryBaseDapper, IProspectRepositoryDapper
    {
        public ProspectRepositoryDapper(IConfiguration configuration) :base(configuration.GetConnectionString("CRM")!)
        {
                
        }
        public async Task<IEnumerable<Prospect>> GetAllProspect()
        {
            return await ExecuteAsync<Prospect>(SP.GetAllProspect);
        }
    }
}
