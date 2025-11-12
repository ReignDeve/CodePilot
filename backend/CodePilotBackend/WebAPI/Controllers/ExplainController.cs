using Application.Interfaces;
using CodePilot.Backend.WebAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CodePilot.Backend.WebAPI.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api/explain")]
  public sealed class ExplainController : ControllerBase
  {
    private readonly IExplainService _explain;
    private readonly ILogger<ExplainController> _logger;

    public ExplainController(IExplainService explain, ILogger<ExplainController> logger) { _explain = explain;
      _logger = logger;
    }
    public record ExplainTaskRequest(Guid TaskId, string Code);

    [HttpPost("task")]
    public async Task<ActionResult<string>> PostForTask(
        [FromBody] ExplainTaskRequest req,
        CancellationToken ct)
    {
      var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
            ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

      if (!Guid.TryParse(sub, out var userId)) return Forbid();
      if (string.IsNullOrWhiteSpace(req.Code))
        return BadRequest("Code darf nicht leer sein.");

      var explanation = await _explain.ExplainTaskAsync(userId,
          req.TaskId, req.Code, ct);

      return Ok(explanation);
    }

    [HttpPost("km")]
    public async Task<ActionResult<string>> PostForKM(
        [FromBody] ExplainTaskRequest req,
        CancellationToken ct)
    {
      var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
            ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

      if (!Guid.TryParse(sub, out var userId)) return Forbid();
      if (string.IsNullOrWhiteSpace(req.Code))
        return BadRequest("Code darf nicht leer sein.");

      var explanation = await _explain.KMFeedbackAsync(userId,
          req.TaskId, req.Code, ct);

      return Ok(explanation);
    }

    [HttpPost("kr")]
    public async Task<ActionResult<string>> PostForKR([FromBody] ExplainTaskRequest req, CancellationToken ct)
    {
      var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
             ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      if (!Guid.TryParse(sub, out var userId)) return Forbid();
      if (req is null) return BadRequest("Body fehlt.");
      if (req.TaskId == Guid.Empty) return BadRequest("TaskId fehlt.");
      if (string.IsNullOrWhiteSpace(req.Code)) return BadRequest("Code darf nicht leer sein.");

      try
      {
        var explanation = await _explain.KRFeedbackAsync(userId, req.TaskId, req.Code, ct);
        return Ok(explanation);
      }
      catch (HttpRequestException ex)   // z.B. OpenAI 401/404/429/Timeout
      {
        _logger.LogError(ex, "OpenAI/HTTP error in KR");
        return StatusCode(502, new { message = "OpenAI HTTP error", detail = ex.Message });
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "KR failed");
        return StatusCode(500, new { message = ex.Message });
      }
    }

    [HttpPost("kh")]
    public async Task<ActionResult<string>> PostForKH(
        [FromBody] ExplainTaskRequest req,
        CancellationToken ct)
    {
      var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
            ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

      if (!Guid.TryParse(sub, out var userId)) return Forbid();
      if (string.IsNullOrWhiteSpace(req.Code))
        return BadRequest("Code darf nicht leer sein.");

      var explanation = await _explain.KHFeedbackAsync(userId,
          req.TaskId, req.Code, ct);

      return Ok(explanation);
    }

    [HttpPost("question")]
    public async Task<ActionResult<string>> PostForQuestion(
      [FromBody] ExplainTaskWithQuestionRequest req,
      CancellationToken ct)
    {
      var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
            ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

      if (!Guid.TryParse(sub, out var userId)) return Forbid();

      if (string.IsNullOrWhiteSpace(req.Code) || string.IsNullOrWhiteSpace(req.Question))
        return BadRequest("Code oder Frage darf nicht leer sein.");
      if (req.TaskId == Guid.Empty)
        return BadRequest("TaskId darf nicht null sein");

      var explanation = await _explain.ExplainCodeAsync(userId, req.Code, req.Question, req.TaskId, ct);
      return Ok(explanation);
    }
  }

}
