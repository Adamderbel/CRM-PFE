using CRM.Entities.Crm;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRM.Entities.Comm
{
    [Table("CauseEchecs", Schema = "comm")]
    public class CauseEchec
    {
        [Key]
        public int Id { get; set; }

        public string? Libelle { get; set; }

        // Navigation Property
        public ICollection<LigneProspection>? LigneProspections { get; set; }
    }
}