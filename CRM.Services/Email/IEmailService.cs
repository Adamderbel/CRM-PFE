using CRM.Entities.Crm;
using System.Threading.Tasks;

namespace CRM.Services.Email
{
    public interface IEmailService
    {
        Task SendDevisEmailAsync(LigneProspection ligneProspection, string userEmail, string notes, string date);
    }
}
