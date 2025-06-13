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
    /// Explains the given code.
    /// </summary>
    Task<string> ExplainCodeAsync(string code, CancellationToken ct = default);
    /// <summary>
    /// Explains the given code in context of description and more information.
    /// </summary>
    Task<string> ExplainTaskAsync(Guid taskId, string code, CancellationToken ct = default);
    Task<string> KRFeedbackAsync(Guid taskId, string code, CancellationToken ct = default);
    Task<string> KMFeedbackAsync(Guid taskId, string code, CancellationToken ct = default);
    Task<string> KHFeedbackAsync(Guid taskId, string code, CancellationToken ct = default);
  }
}
