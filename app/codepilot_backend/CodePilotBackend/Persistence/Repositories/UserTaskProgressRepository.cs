using CodePilot.Persistence.Db;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;


namespace Persistence.Repositories
{
  public class UserTaskProgressRepository : IUserTaskProgressRepository
  {
    private readonly CodePilotDbContext _db;
    public UserTaskProgressRepository(CodePilotDbContext db) => _db = db;

    public async Task AddAsync(UserTaskProgress utp, CancellationToken ct = default)
        => await _db.UserTaskProgress.AddAsync(utp, ct);

    public Task<IReadOnlyList<UserTaskProgress>> GetByUserAsync(Guid userId, CancellationToken ct = default)
        => _db.UserTaskProgress
              .AsNoTracking()
              .Where(u => u.UserId == userId)
              .ToListAsync(ct)
              .ContinueWith(t => (IReadOnlyList<UserTaskProgress>)t.Result, ct);

    public Task<UserTaskProgress?> FindAsync(Guid userId, Guid taskId, CancellationToken ct = default)
        => _db.UserTaskProgress
              .AsNoTracking()
              .FirstOrDefaultAsync(u => u.UserId == userId && u.TaskId == taskId, ct);

    public Task SaveChangesAsync(CancellationToken ct = default)
        => _db.SaveChangesAsync(ct);
  }
}
