using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CodePilot.Backend.WebAPI.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthController : ControllerBase
  {
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth) => _auth = auth;

    public record RegisterDto(string UserName, string Password);
    public record LoginDto(string UserName, string Password);

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
      await _auth.RegisterAsync(dto.UserName, dto.Password);
      return NoContent();
    }

    [HttpPost("login")]
    public async Task<ActionResult<string>> Login([FromBody] LoginDto dto)
    {
      var token = await _auth.LoginAsync(dto.UserName, dto.Password);
      return Ok(token);
    }
  }
}
