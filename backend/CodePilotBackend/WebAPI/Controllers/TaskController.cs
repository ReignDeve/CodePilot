using CodePilot.Backend.WebAPI.Models;
using Domain.Entities;
using Domain.Enums;
using Domain.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence.Repositories;
using System.Linq;
using System.Threading.Tasks;

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
          t.ExternalId,
          t.Description,
          t.Solution,
          t.Invocations
        .OrderBy(i => i.Order)           
        .Select(i => i.Value)
        .ToArray()));

      return Ok(dto);
    }


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

    [HttpPut("/addInvocations")]
    public async Task<IActionResult> AddInvocations(Guid id, [FromBody] TaskInvocation  body, CancellationToken ct)
    {
      await _repo.AddInvocation(body, ct);
      return Ok();
    }

    [HttpGet("{id}/getInvocations")]
    public async Task<ActionResult> getInvocations(Guid id, CancellationToken ct)
    {
      var inv = await _repo.GetInvocations(id, ct);  // <-- await!
      if (inv is null) return NotFound();
      return Ok(inv);
    }

  }
}
