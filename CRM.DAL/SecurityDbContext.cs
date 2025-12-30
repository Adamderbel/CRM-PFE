using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CRM.Entities.Security;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace CRM.DAL
{
    public class SecurityDbContext: IdentityDbContext<SecUser,SecRole,Guid,IdentityUserClaim<Guid>,UserRole,
        IdentityUserLogin<Guid>,IdentityRoleClaim<Guid>,IdentityUserToken<Guid>>
    {
        public SecurityDbContext(DbContextOptions<SecurityDbContext> options):base(options)
        {
                
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Utiliser le schéma "sec"
            builder.HasDefaultSchema("sec");

            // Renommer les tables si besoin pour matcher ton schéma
            builder.Entity<SecUser>(b => { b.ToTable("Users"); });
            builder.Entity<SecRole>(b => { b.ToTable("Roles"); });
            builder.Entity<UserRole>(b => { b.ToTable("UserRoles"); });
            builder.Entity<IdentityUserClaim<Guid>>(b => { b.ToTable("UserClaims"); });
            builder.Entity<IdentityRoleClaim<Guid>>(b => { b.ToTable("RoleClaims"); });
            

           
        }

    }
}
