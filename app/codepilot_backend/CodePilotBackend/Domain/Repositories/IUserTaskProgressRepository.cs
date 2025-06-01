using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Repositories
{
  public interface IUserTaskProgressRepository
  {
    Task AddAsync(UserTaskProgress utp, CancellationToken ct = default);
    Task<IReadOnlyList<UserTaskProgress>> GetByUserAsync(Guid userId, CancellationToken ct = default);
    Task<UserTaskProgress?> FindAsync(Guid userId, Guid taskId, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
  }
}
