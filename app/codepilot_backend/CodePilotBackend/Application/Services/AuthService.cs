using Application.Interfaces;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;


namespace Application.Services
{
  public sealed class AuthService : IAuthService
  {
    private readonly IUserRepository _users;
    private readonly IUserTaskProgressRepository _prog;
    private readonly ITaskRepository _taskRepo;
    private readonly IPasswordHasher<User> _hasher;
    private readonly IConfiguration _cfg;

    public AuthService(
        IUserRepository users,
        IUserTaskProgressRepository prog,
        ITaskRepository taskRepo,
        IPasswordHasher<User> hasher,
        IConfiguration cfg)
    {
      _users = users;
      _prog = prog;
      _taskRepo = taskRepo;
      _hasher = hasher;
      _cfg = cfg;
    }

    public async Task RegisterAsync(string userName, string password, CancellationToken ct = default)
    {
      if (await _users.FindByNameAsync(userName, ct) is not null)
        throw new InvalidOperationException("User existiert bereits");

      // Create user and hash password
      var user = User.Create(userName);
      user.SetPassword(password, _hasher);

      await _users.AddAsync(user, ct);
      await _users.SaveChangesAsync(ct);

      // Seed all existing tasks for this new user
      var allTasks = await _taskRepo.GetAllAsync(ct);
      foreach (var codingTask in allTasks)
      {
        var progress = UserTaskProgress.Create(user.Id, codingTask.Id);
        await _prog.AddAsync(progress, ct);
      }
      await _prog.SaveChangesAsync(ct);
    }

    public async Task<string> LoginAsync(string userName, string password, CancellationToken ct = default)
    {
      var user = await _users.FindByNameAsync(userName, ct)
                 ?? throw new InvalidOperationException("Ungültige Anmeldedaten");

      var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, password);
      if (result == PasswordVerificationResult.Failed)
        throw new InvalidOperationException("Ungültige Anmeldedaten");

      // ⚠️ siehe Punkt 2 bzgl. Rehash + Tracking
      if (result == PasswordVerificationResult.SuccessRehashNeeded)
      {
        user.SetPassword(password, _hasher);
        await _users.SaveChangesAsync(ct);
      }

      var now = DateTime.UtcNow;
      var claims = new[]
      {
    // WICHTIG:
    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
    new Claim(JwtRegisteredClaimNames.Iat, new DateTimeOffset(now).ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64),
  };

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_cfg["Jwt:Key"]!));
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
        issuer: _cfg["Jwt:Issuer"],
        audience: _cfg["Jwt:Audience"],
        claims: claims,
        notBefore: now,
        expires: now.AddHours(4),
        signingCredentials: creds
      );

      return new JwtSecurityTokenHandler().WriteToken(token);
    }
  }
}
