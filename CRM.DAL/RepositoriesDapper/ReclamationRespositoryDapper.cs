using CRM.DAL.GenericRepository;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.DAL.RepositoriesDapper
{
    public class ReclamationRespositoryDapper : RepositoryBaseDapper, IReclamationRespositoryDapper
    {
        public ReclamationRespositoryDapper(IConfiguration configuration) : base(configuration.GetConnectionString("CRM")!)
        {
        }
    }
}
