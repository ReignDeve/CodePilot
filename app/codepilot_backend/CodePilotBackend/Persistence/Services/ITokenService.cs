using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Services
{
  public interface ITokenService
  {
    string CreateToken(Guid userId, string userName, IEnumerable<string>? roles = null, TimeSpan? lifetime = null);
  }
}
