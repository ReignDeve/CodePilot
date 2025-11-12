using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
  public interface IAuthService
  {
    Task RegisterAsync(string userName, string password, CancellationToken ct = default);
    Task<string> LoginAsync(string userName, string password, CancellationToken ct = default);
  }
}
