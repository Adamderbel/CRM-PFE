using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Services.comm
{
    public class CodeGeneratorService
    {
        public string GenerateCode(string prefix)
        {
            var datePart = DateTime.Now.ToString("yyyyMMdd");
            var randomPart = Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper();

            return $"{prefix}-{datePart}-{randomPart}";
        }
    }
}
