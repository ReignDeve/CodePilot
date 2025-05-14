using Application.Interfaces;
using Microsoft.SemanticKernel;



namespace Application.Services
{
  public sealed class ExplainService : IExplainService
  {
    private readonly Kernel _kernel;
    private readonly KernelFunction _explain;

    public ExplainService(Kernel kernel)
    {
      _kernel = kernel;

      // Sprach- oder Modell-Prompts hier zentral hinterlegen
      _explain = _kernel.CreateFunctionFromPrompt(
          @"Erkläre prägnant und verständlich auf Deutsch, was folgendes bedeutet: 
{{$input}}",
          functionName: "Explain");
    }

    public async Task<string> ExplainAsync(string input, CancellationToken ct = default)
    {
      var result = await _kernel.InvokeAsync(
          _explain,
          new() { ["input"] = input },
          cancellationToken: ct);

      return result.GetValue<string>() ?? string.Empty;
    }
  }
}
