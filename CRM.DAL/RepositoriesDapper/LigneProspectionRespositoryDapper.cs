using CRM.DAL.GenericRepository;
using CRM.Entities.Crm;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.DAL.RepositoriesDapper
{
    public class LigneProspectionRespositoryDapper : RepositoryBaseDapper, ILigneProspectionRespositoryDapper
    {
        public LigneProspectionRespositoryDapper(IConfiguration configuration) : base(configuration.GetConnectionString("CRM")!)
        {
        }

        
    }
}