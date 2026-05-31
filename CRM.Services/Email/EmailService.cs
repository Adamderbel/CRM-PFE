using CRM.Entities.Crm;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace CRM.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendDevisEmailAsync(LigneProspection ligneProspection, string userEmail, string notes, string date)
        {
            var host = _configuration["SmtpSettings:Host"];
            var port = int.Parse(_configuration["SmtpSettings:Port"]);
            var username = _configuration["SmtpSettings:Username"];
            var password = _configuration["SmtpSettings:Password"];
            var enableSsl = bool.Parse(_configuration["SmtpSettings:EnableSsl"]);
            var fromEmail = _configuration["SmtpSettings:FromEmail"];

            using var client = new SmtpClient(host, port);
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential(username, password);
            client.EnableSsl = enableSsl;

            var famille = ligneProspection.FamilleProduit?.Libelle ?? "Non défini";
            var support = ligneProspection.SupportProduit?.Libelle ?? "Non défini";
            var nomProspect = ligneProspection.Prospection?.Prospect != null 
                ? $"{ligneProspection.Prospection.Prospect.Nom}".Trim() 
                : "Non défini";

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail),
                Subject = $"Nouvelle demande de devis : {ligneProspection.Designation}",
                Body = $@"
                    <h2>Demande de devis</h2>
                    <p><strong>Ligne de Prospection :</strong> {ligneProspection.Designation}</p>
                    <p><strong>Nom du prospect :</strong> {nomProspect}</p>
                    <p><strong>Famille de produit :</strong> {famille}</p>
                    <p><strong>Support de produit :</strong> {support}</p>
                    <p><strong>Date de la demande :</strong> {date}</p>
                    <p><strong>Email du demandeur :</strong> {userEmail}</p>
                    <p><strong>Notes :</strong></p>
                    <p>{notes}</p>
                ",
                IsBodyHtml = true
            };

            // Envoyez l'email au demandeur (userEmail) et mettez l'admin en copie (Bcc)
            if (!string.IsNullOrWhiteSpace(userEmail))
            {
                mailMessage.To.Add(userEmail);
            }
            
            var adminEmail = _configuration["SmtpSettings:AdminEmail"];
            if (!string.IsNullOrWhiteSpace(adminEmail))
            {
                mailMessage.Bcc.Add(adminEmail);
            }

            await client.SendMailAsync(mailMessage);
        }
    }
}
