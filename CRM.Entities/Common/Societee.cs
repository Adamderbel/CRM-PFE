using CRM.Entities.Crm;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRM.Entities.Comm
{
    [Table("Societees", Schema = "comm")]
    public class Societee
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nchar(50)")]
        public string? Nom { get; set; }

        // Navigation Property
        public ICollection<LigneProspection>? LigneProspections { get; set; }
    }
}