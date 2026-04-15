using CRM.DAL.GenericRepository;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.DAL.RepositoriesDapper
{
    public class StatutProspectionRepositoryDapper : RepositoryBaseDapper, IStatutProspectionRepositoryDapper
    {
        public StatutProspectionRepositoryDapper(IConfiguration configuration) : base(configuration.GetConnectionString("CRM")!)
        {
        }
    }
}
