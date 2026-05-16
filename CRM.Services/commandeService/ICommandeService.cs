using CRM.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.commandeService
{
    public interface ICommandeService
    {
        Task<List<CermCommande>> GetCommandesByClientAsync(
     string clientId);

        Task<CermCommande?> GetCommandeAsync(
            string refCommande);
        Task<List<CermCommandeLigne>> GetLignesCommandeByRefAsync(string refCommande);
    }
}
