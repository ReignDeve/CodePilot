using Application.Interfaces;
using Domain.Entities;
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

    public async Task<string> ExplainCodeAsync(
      Guid userId,
        string code,
        string question,
        Guid taskId,
        CancellationToken ct = default)
    {
      var task = await _tasks.FindByIdAsync(taskId, ct)
                 ?? throw new InvalidOperationException($"Task {taskId} not found");
      return await _tutor.ExplainWithContextAsync(userId, code, question, task.Description, ct);
    }

    public async Task<string> ExplainTaskAsync(
      Guid userId,

        Guid taskId,
        string code,
        CancellationToken ct = default)
    {
      var task = await _tasks.FindByIdAsync(taskId, ct)
                 ?? throw new InvalidOperationException($"Task {taskId} not found");

      return await _tutor.ExplainTaskAsync(userId, code, task.Description, ct);
    }
    public async Task<string> KRFeedbackAsync(
      Guid userId,

        Guid taskId,
        string code,
        CancellationToken ct = default)
    {
      var task = await _tasks.FindByIdAsync(taskId, ct)
                 ?? throw new InvalidOperationException($"Task {taskId} not found");

      return await _tutor.KRFeedbackAsync(userId, code, task.Description, ct);
    }
    public async Task<string> KHFeedbackAsync(
      Guid userId,

        Guid taskId,
        string code,
        CancellationToken ct = default)
    {
      var task = await _tasks.FindByIdAsync(taskId, ct)
                 ?? throw new InvalidOperationException($"Task {taskId} not found");

      return await _tutor.KHFeedbackAsync(userId, code, task.Description, ct);
    }
    public async Task<string> KMFeedbackAsync(
      Guid userId,

        Guid taskId,
        string code,
        CancellationToken ct = default)
    {
      var task = await _tasks.FindByIdAsync(taskId, ct)
                 ?? throw new InvalidOperationException($"Task {taskId} not found");

      return await _tutor.KMFeedbackAsync(userId, code, task.Description, ct);
    }

  }
}
