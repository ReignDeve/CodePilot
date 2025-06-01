using Application.Interfaces;
using Domain.Repositories;
using Microsoft.SemanticKernel;
using System.Threading.Tasks;



namespace Application.Services
{
  public sealed class ExplainService : IExplainService
  {
    //    private readonly Kernel _kernel;
    //    private readonly ITaskRepository _tasks;
    //    private readonly KernelFunction _explainFn;

    //    public ExplainService(Kernel kernel, ITaskRepository tasks)
    //    {
    //      _kernel = kernel;
    //      _tasks = tasks;

    //      // Prompt benutzt jetzt {{$description}} und {{$code}} statt {{$input}}
    //      _explainFn = _kernel.CreateFunctionFromPrompt(
    //          @"Kontext: {{description}}. 
    //Du bist ein Code-Tutor für C#. Du bekommst Codeausschnitte zur Verfügung gestellt und musst Feedback geben.
    //Bitte gib nur didaktisches Feedback, keine vollständigen Lösungen. Erkläre nicht zu viel. 
    //Der Benutzer soll noch selbst denken müssen. 
    //Folgender Code-Ausschnitt: 
    //{{code}}",
    //          functionName: "ExplainWithContext");
    //    }

    //    public Task<string> ExplainCodeAsync(string code, CancellationToken ct = default)
    //       => ExplainAsyncInternal(code, "", ct);

    //    public async Task<string> ExplainTaskAsync(Guid taskId, string code, CancellationToken ct = default)
    //    {
    //      var task = await _tasks.FindByIdAsync(taskId, ct);
    //      if (task is null) throw new InvalidOperationException($"Task {taskId} nicht gefunden");

    //      return await ExplainAsyncInternal(code, task.Description, ct);
    //    }

    //    private async Task<string> ExplainAsyncInternal(string code, string description, CancellationToken ct)
    //    {
    //      foreach (var plugin in _kernel.Plugins)
    //      {
    //        Console.WriteLine($"Plugin: {plugin.Name}");
    //        foreach (var func in plugin)          // func.Key = Funktionsname
    //          Console.WriteLine($" └─ {func.PluginName}");
    //      }
    //      var result = await _kernel.InvokeAsync(
    //          _explainFn,
    //          new KernelArguments
    //          {
    //            ["code"] = code,
    //            ["description"] = description
    //          },
    //          cancellationToken: ct);

    //      return result.GetValue<string>() ?? "";
    //    }
    private readonly ICodeTutor _tutor;
    private readonly ITaskRepository _tasks;

    public ExplainService(ICodeTutor tutor, ITaskRepository tasks)
    {
      _tutor = tutor;
      _tasks = tasks;
    }

    public Task<string> ExplainCodeAsync(
        string code,
        CancellationToken ct = default)
        => _tutor.ExplainWithContextAsync(code, string.Empty, ct);

    public async Task<string> ExplainTaskAsync(
        Guid taskId,
        string code,
        CancellationToken ct = default)
    {
      var task = await _tasks.FindByIdAsync(taskId, ct)
                 ?? throw new InvalidOperationException($"Task {taskId} nicht gefunden");

      return await _tutor.ExplainWithContextAsync(code, task.Description, ct);
    }

  }
}
