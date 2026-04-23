using CRM.DAL.GenericRepository;
using CRM.Entities.Common;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.DAL.RepositoriesDapper
{
    public class ProduitCermRespositoryDapper : RepositoryBaseDapper , IProduitCermRespositoryDapper
    {
        public ProduitCermRespositoryDapper(IConfiguration configuration) : base(configuration.GetConnectionString("CRM")!)
        {
        }

        
    }
}
