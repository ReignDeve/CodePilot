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
        => _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserName == name, ct);

    public Task<User?> FindByIdAsync(Guid id, CancellationToken ct = default)
        => _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id, ct);

    public Task SaveChangesAsync(CancellationToken ct = default)
        => _db.SaveChangesAsync(ct);
  }
}
