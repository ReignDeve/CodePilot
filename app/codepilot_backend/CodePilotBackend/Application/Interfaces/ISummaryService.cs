using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
  public interface ISummaryService
  {
    /// <summary>
    /// Summarises a user's learning preferences for saving in the user database and for use in prompts.
    /// </summary>
    Task SummariseAsync(Guid userId, string rawpreferences, CancellationToken ct = default);
  }
}
