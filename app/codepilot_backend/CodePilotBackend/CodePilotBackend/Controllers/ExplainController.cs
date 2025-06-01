using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePilot.Backend.WebAPI.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api/explain")]
  public sealed class ExplainController : ControllerBase
  {
    private readonly IExplainService _explain;

    public ExplainController(IExplainService explain) => _explain = explain;

    // ───────────────────────────────
    // Request-DTOs
    // ───────────────────────────────
    public record ExplainCodeRequest(string Code);
    public record ExplainTaskRequest(Guid TaskId, string Code);

    // ───────────────────────────────
    // POST api/explain/code
    // ───────────────────────────────
    [HttpPost("code")]
    public async Task<ActionResult<string>> PostForCode(
        [FromBody] ExplainCodeRequest req,
        CancellationToken ct)
    {
      if (string.IsNullOrWhiteSpace(req.Code))
        return BadRequest("Code darf nicht leer sein.");

      var explanation = await _explain.ExplainCodeAsync(req.Code, ct);
      return Ok(explanation);
    }

    // ───────────────────────────────
    // POST api/explain/task
    // ───────────────────────────────
    [HttpPost("task")]
    public async Task<ActionResult<string>> PostForTask(
        [FromBody] ExplainTaskRequest req,
        CancellationToken ct)
    {
      if (string.IsNullOrWhiteSpace(req.Code))
        return BadRequest("Code darf nicht leer sein.");

      var explanation = await _explain.ExplainTaskAsync(
          req.TaskId, req.Code, ct);

      return Ok(explanation);
    }
  }

}
