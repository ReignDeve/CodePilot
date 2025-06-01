using Application.Interfaces;
using Microsoft.SemanticKernel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
  public sealed class CodeTutor : ICodeTutor
  {
    private readonly Kernel _kernel;
    private readonly KernelFunction _explain;

    public CodeTutor(Kernel kernel)
    {
      _kernel = kernel;
      // Plugin- und Funktions-Lookup:
      _explain = _kernel.Plugins["Explain"]["ExplainExercise"];
    }

    public async Task<string> ExplainWithContextAsync(
        string code,
        string description,
        CancellationToken ct = default)
    {
      var args = new KernelArguments
      {
        ["code"] = code,
        ["description"] = description
      };

      var result = await _kernel.InvokeAsync(_explain, args, ct);
      Console.Write("Result", result);
      return result.GetValue<string>() ?? string.Empty;
    }
  }
}
