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
    /// Erklärt den übergebenen Code nur.
    /// </summary>
    Task<string> ExplainCodeAsync(string code, CancellationToken ct = default);
    /// <summary>
    /// Erklärt den übergebenen Code im Kontext des Task mit der gegebenen Id.
    /// </summary>
    Task<string> ExplainTaskAsync(Guid taskId, string code, CancellationToken ct = default);
  }
}
