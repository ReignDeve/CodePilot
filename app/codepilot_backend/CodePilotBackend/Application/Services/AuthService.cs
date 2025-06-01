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

      Console.WriteLine($"[Login] StoredHash = {user.PasswordHash}");
      var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, password);
      Console.WriteLine($"[Login] VerifyHashedPassword returned: {result}");

      if (result == PasswordVerificationResult.Failed)
        throw new InvalidOperationException("Ungültige Anmeldedaten");

      if (result == PasswordVerificationResult.SuccessRehashNeeded)
      {
        // optional: rehash and persist
        user.SetPassword(password, _hasher);
        await _users.SaveChangesAsync(ct);
      }

      // create JWT token
      var claims = new[]
      {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName)
        };

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_cfg["Jwt:Key"]!));
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
      var expires = DateTime.UtcNow.AddHours(4);

      var token = new JwtSecurityToken(
          issuer: _cfg["Jwt:Issuer"],
          audience: _cfg["Jwt:Audience"],
          claims: claims,
          expires: expires,
          signingCredentials: creds
      );

      return new JwtSecurityTokenHandler().WriteToken(token);
    }
  }
}
