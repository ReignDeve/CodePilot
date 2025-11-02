using CodePilot.Persistence.Db;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;


namespace Persistence.Repositories
{
  public class UserRepository : IUserRepository
  {
    private readonly CodePilotDbContext _db;
    public UserRepository(CodePilotDbContext db) => _db = db;

    public async Task AddAsync(User u, CancellationToken ct = default)
        => await _db.Users.AddAsync(u, ct);

    public Task<User?> FindByNameAsync(string name, CancellationToken ct = default)
        => _db.Users.FirstOrDefaultAsync(u => u.UserName == name, ct);

    public Task<User?> FindByIdAsync(Guid id, CancellationToken ct = default)
        => _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id, ct);

    public Task SaveChangesAsync(CancellationToken ct = default)
        => _db.SaveChangesAsync(ct);

    public async Task SetLearningPreferencesAsync(Guid userId, string preferences, CancellationToken ct = default)
    {
      // Wichtig: Für Updates ohne AsNoTracking laden, damit EF tracked
      var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId, ct);
      if (user is null)
        throw new KeyNotFoundException($"User {userId} nicht gefunden.");

      user.SetLearningPreferences(preferences);
      await _db.SaveChangesAsync(ct);
    }

    public async Task<string> GetLearningPreferencesAsync(Guid userId, CancellationToken ct = default)
    {
      var row = await _db.Users
        .AsNoTracking()
        .Where(u => u.Id == userId)
        .Select(u => new { u.LearningPreferences })
        .FirstOrDefaultAsync(ct);

      if (row is null)
        throw new KeyNotFoundException($"User {userId} nicht gefunden.");

      return row.LearningPreferences; 
    }
  }
}
