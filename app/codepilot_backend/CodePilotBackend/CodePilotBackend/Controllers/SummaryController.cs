using Application.Interfaces;
using CodePilot.Backend.WebAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;

namespace CodePilot.Backend.WebAPI.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api/summary")]
  public sealed class SummaryController : ControllerBase
  {
    private readonly ISummaryService _summary;


    public SummaryController(ISummaryService summary) => _summary = summary;

    [HttpPost("summary")]
    public async Task<IActionResult> Summarise(
   [FromBody] SummaryRequest request,
   CancellationToken ct)
    {
      var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
            ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

      if (!Guid.TryParse(sub, out var userId)) return Forbid();

      var json = JsonSerializer.Serialize(request);
      await _summary.SummariseAsync(userId, json, ct);
      return NoContent();
    }
  }
}
