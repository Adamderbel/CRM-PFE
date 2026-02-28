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
        public DataContext()
        {
            

        }
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }


    }
}
