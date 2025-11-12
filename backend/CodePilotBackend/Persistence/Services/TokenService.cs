using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Persistence.Services;

public sealed class TokenService : ITokenService
{
  private readonly IConfiguration _config;
  public TokenService(IConfiguration config) => _config = config;

  public string CreateToken(Guid userId, string userName, IEnumerable<string>? roles = null, TimeSpan? lifetime = null)
  {
    var issuer = _config["Jwt:Issuer"]!;
    var audience = _config["Jwt:Audience"]!;
    var key = _config["Jwt:Key"]!;
    var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
    var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

    var now = DateTime.UtcNow;
    var claims = new List<Claim>
    {
      new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
      new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
      new Claim(JwtRegisteredClaimNames.UniqueName, userName),
      new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
      new Claim(JwtRegisteredClaimNames.Iat, new DateTimeOffset(now).ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64),
    };
    if (roles != null) claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

    var token = new JwtSecurityToken(
      issuer: issuer,
      audience: audience,
      claims: claims,
      notBefore: now,
      expires: now.AddHours(12),
      signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
  }
}
