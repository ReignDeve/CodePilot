using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
  public interface IExplainService
  {
    /// <summary>
    /// Liefert eine verständliche Erklärung für den übergebenen Text.
    /// </summary>
    Task<string> ExplainAsync(string input, CancellationToken ct = default);
  }
}
