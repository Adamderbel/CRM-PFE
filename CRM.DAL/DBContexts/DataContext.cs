using CRM.Entities.Comm;
using CRM.Entities.Common;
using CRM.Entities.Crm;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.DAL.DBContexts
{
    public class DataContext: DbContext
    {
        public DbSet<Prospect> Prospects { get; set; }
        public DbSet<DomaineActivites> DomaineActivites { get; set; }
        public DbSet<StatutProspection> StatutProspections { get; set; }
        public DbSet<Prospection> Prospections { get; set; }
        public DbSet<LigneProspection> LigneProspections { get; set; }
        public DbSet<CauseEchec> CauseEchecs { get; set; }
        public DbSet<FamilleProduit> FamilleProduits { get; set; }
        public DbSet<SupportProduit> SupportProduits { get; set; }
        public DbSet<Societee> Societees { get; set; }  
        public DataContext()
        {
            

        }
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }


    }
}
