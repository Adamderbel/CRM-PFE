using CRM.DAL.GenericRepository;
using CRM.Entities.Common;
using CRM.Entities.Crm;
using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
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

        public async Task<IEnumerable<ProduitCerm>> RechercherProduitCerm(string recherche)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Recherche", recherche, DbType.String);

            return await ExecuteAsync<ProduitCerm>(SP.sp_RechercherProduitCerm, parameters);
        }
    }
}
