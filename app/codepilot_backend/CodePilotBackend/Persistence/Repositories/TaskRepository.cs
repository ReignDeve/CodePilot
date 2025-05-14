using CodePilot.Persistence.Db;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;


namespace Persistence.Repositories
{
  public sealed class TaskRepository : ITaskRepository
  {
    private readonly CodePilotDbContext _db;
    public TaskRepository(CodePilotDbContext db) => _db = db;

    public Task AddAsync(CodingTask task, CancellationToken ct = default)
        => _db.Tasks.AddAsync(task, ct).AsTask();

    public Task SaveChangesAsync(CancellationToken ct = default)
        => _db.SaveChangesAsync(ct);

    public Task<IReadOnlyList<CodingTask>> GetAllAsync(CancellationToken ct = default)
        => _db.Tasks.AsNoTracking().ToListAsync(ct)
                    .ContinueWith(t => (IReadOnlyList<CodingTask>)t.Result, ct);

    public Task<CodingTask?> FindByIdAsync(Guid id, CancellationToken ct = default)
        => _db.Tasks.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id, ct);
  }
}
