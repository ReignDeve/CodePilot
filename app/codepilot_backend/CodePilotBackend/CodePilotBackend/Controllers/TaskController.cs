using CodePilot.Backend.WebAPI.Models;
using Domain.Enums;
using Domain.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence.Repositories;

namespace CodePilot.Backend.WebAPI.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api/[controller]")]
  public sealed class TasksController : ControllerBase
  {
    private readonly ITaskRepository _repo;
    public TasksController(ITaskRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetTasks>>> GetAll(CancellationToken ct)
    {
      var tasks = await _repo.GetAllAsync(ct);

      var dto = tasks.Select(t => new GetTasks(
          t.Id,
          t.Title,
          t.Status.ToString(),
          t.Difficulty.ToString(),
          t.Code,
          t.Description,
          t.Solution));

      return Ok(dto);
    }

    // Controllers/TasksController.cs  (nur Ergänzung)
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetTasks>> GetById(Guid id, CancellationToken ct)
    {
      var task = await _repo.FindByIdAsync(id, ct);
      return task is null
          ? NotFound()
          : Ok(task.ToDto());
    }

    public record StatusUpdateDto(string Status);

    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> SetStatus(Guid id,
    [FromBody] StatusUpdateDto dto, CancellationToken ct)
    {
      var task = await _repo.FindByIdAsync(id, ct);
      if (task is null) return NotFound();

      var normalized = dto.Status.Replace(" ", "", StringComparison.Ordinal);
      if (!Enum.TryParse<Domain.Enums.TaskStatus>(normalized, true, out var newStatus))
        return BadRequest($"Status '{dto.Status}' ist ungültig.");

      task.SetStatus(newStatus);
      (_repo as TaskRepository)?.Attach(task);
      await _repo.SaveChangesAsync(ct);
      return NoContent();
    }

  }
}
