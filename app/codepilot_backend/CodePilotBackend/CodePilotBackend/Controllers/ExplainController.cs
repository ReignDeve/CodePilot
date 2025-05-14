using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CodePilot.Backend.WebAPI.Controllers
{
  [ApiController]
  [Route("api/explain")]
  public sealed class ExplainController : ControllerBase
  {
    private readonly IExplainService _explain;

    public ExplainController(IExplainService explain) => _explain = explain;

    /* ---------- JSON-Variante ------------------------------------------------- */

    // POST api/explain   (Content-Type: application/json)
    public sealed record ExplainRequest(string Text);

    [HttpPost]
    [Consumes("application/json")]
    public async Task<ActionResult<string>> PostJson(
        [FromBody] ExplainRequest body, CancellationToken ct)
    {
      if (string.IsNullOrWhiteSpace(body.Text))
        return BadRequest("Text darf nicht leer sein.");

      var answer = await _explain.ExplainAsync(body.Text, ct);
      return Ok(answer);
    }
  }

}
