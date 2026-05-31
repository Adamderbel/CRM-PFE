using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Entities.Common
{
    [Table("ClientCerm", Schema = "comm")]
    public class ClientCerm
    {
        [Key]
        public int RefClient { get; set; }

        public string? Nom { get; set; }
        public DateTime? LastModifiedDate { get; set; }
        public DateTime? LastSyncDate { get; set; }
        [Column("user_id ")]
        public Guid? idUser { get; set; }
    }
}
