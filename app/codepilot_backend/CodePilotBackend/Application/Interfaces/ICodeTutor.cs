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
          string code,
          string description,
          CancellationToken ct = default);
    Task<string> KHFeedbackAsync(
          string code,
          string description,
          CancellationToken ct = default);
    Task<string> KMFeedbackAsync(
          string code,
          string description,
          CancellationToken ct = default);
    Task<string> KRFeedbackAsync(
          string code,
          string description,
          CancellationToken ct = default);
  }

}
