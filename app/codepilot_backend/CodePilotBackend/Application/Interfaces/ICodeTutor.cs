using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{

  public interface ICodeTutor
  {
    Task<string> ExplainWithContextAsync(
        Guid userId,
        string code,
        string question,
        string description,
        CancellationToken ct = default);
    Task<string> ExplainTaskAsync(
        Guid userId,
        string code,
        string description,
        CancellationToken ct = default);
    Task<string> KHFeedbackAsync(
        Guid userId,
        string code,
        string description,
        CancellationToken ct = default);
    Task<string> KMFeedbackAsync(
        Guid userId,
        string code,
        string description,
        CancellationToken ct = default);
    Task<string> KRFeedbackAsync(
        Guid userId,
        string code,
        string description,
        CancellationToken ct = default);

    Task<string> GetPreferencesAsync(Guid userid, CancellationToken ct = default);
  }

}
