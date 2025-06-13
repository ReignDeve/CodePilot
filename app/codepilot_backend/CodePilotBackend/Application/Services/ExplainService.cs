using Application.Interfaces;
using Domain.Repositories;
using Microsoft.SemanticKernel;
using System.Threading.Tasks;



namespace Application.Services
{
  public sealed class ExplainService : IExplainService
  {
    
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
                 ?? throw new InvalidOperationException($"Task {taskId} not found");

      return await _tutor.ExplainWithContextAsync(code, task.Description, ct);
    }
    public async Task<string> KRFeedbackAsync(
        Guid taskId,
        string code,
        CancellationToken ct = default)
    {
      var task = await _tasks.FindByIdAsync(taskId, ct)
                 ?? throw new InvalidOperationException($"Task {taskId} not found");

      return await _tutor.KRFeedbackAsync(code, task.Description, ct);
    }
    public async Task<string> KHFeedbackAsync(
        Guid taskId,
        string code,
        CancellationToken ct = default)
    {
      var task = await _tasks.FindByIdAsync(taskId, ct)
                 ?? throw new InvalidOperationException($"Task {taskId} not found");

      return await _tutor.KHFeedbackAsync(code, task.Description, ct);
    }
    public async Task<string> KMFeedbackAsync(
        Guid taskId,
        string code,
        CancellationToken ct = default)
    {
      var task = await _tasks.FindByIdAsync(taskId, ct)
                 ?? throw new InvalidOperationException($"Task {taskId} not found");

      return await _tutor.KMFeedbackAsync(code, task.Description, ct);
    }

  }
}
