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

    public record ExplainCodeRequest(string Code);
    public record ExplainTaskRequest(Guid TaskId, string Code);

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

    [HttpPost("km")]
    public async Task<ActionResult<string>> PostForKM(
        [FromBody] ExplainTaskRequest req,
        CancellationToken ct)
    {
      if (string.IsNullOrWhiteSpace(req.Code))
        return BadRequest("Code darf nicht leer sein.");

      var explanation = await _explain.KMFeedbackAsync(
          req.TaskId, req.Code, ct);

      return Ok(explanation);
    }

    [HttpPost("kr")]
    public async Task<ActionResult<string>> PostForKR(
        [FromBody] ExplainTaskRequest req,
        CancellationToken ct)
    {
      if (string.IsNullOrWhiteSpace(req.Code))
        return BadRequest("Code darf nicht leer sein.");

      var explanation = await _explain.KRFeedbackAsync(
          req.TaskId, req.Code, ct);

      return Ok(explanation);
    }

    [HttpPost("kh")]
    public async Task<ActionResult<string>> PostForKH(
        [FromBody] ExplainTaskRequest req,
        CancellationToken ct)
    {
      if (string.IsNullOrWhiteSpace(req.Code))
        return BadRequest("Code darf nicht leer sein.");

      var explanation = await _explain.KHFeedbackAsync(
          req.TaskId, req.Code, ct);

      return Ok(explanation);
    }
  }

}
