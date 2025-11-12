using Application.Interfaces;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.AspNet.Identity;
using Microsoft.SemanticKernel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
  public sealed class SummaryService : ISummaryService
  {
    private readonly Kernel _kernel;
    private readonly KernelFunction _summary;
    private readonly IUserRepository _users;

    public SummaryService(Kernel kernel, IUserRepository users)
    {
      _kernel = kernel;
      _summary = _kernel.Plugins["ExplainPlugin"]["Summary"];
      _users = users;
    }

    public async Task SummariseAsync(
      Guid userId,
      string rawPreferences,
      CancellationToken cancellationToken = default)
    {
      var args = new KernelArguments
      {
        ["preferences"] = rawPreferences,
      };

      var result = await _kernel.InvokeAsync(_summary, args, cancellationToken);
      var preferences = result.GetValue<string>() ?? string.Empty;

      await _users.SetLearningPreferencesAsync(userId, preferences, cancellationToken);
    }
  }
}
