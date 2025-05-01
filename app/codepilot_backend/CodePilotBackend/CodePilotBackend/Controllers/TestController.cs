using CodePilot.Backend.WebAPI.Models;
using CodePilotBackend;
using Microsoft.AspNetCore.Mvc;

namespace CodePilot.Backend.WebAPI.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class TestController : ControllerBase
  {
    // POST /Test
    [HttpPost]
    public ActionResult<string> Post([FromBody] PilotRequest request)
    {
      // Hier könntest du später mit request.Code und request.Question arbeiten.
      return Ok(request.Code);
    }

  }
}
