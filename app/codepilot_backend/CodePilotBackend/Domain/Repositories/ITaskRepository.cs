using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Repositories
{
  public interface ITaskRepository
  {
    Task AddAsync(CodingTask task, CancellationToken ct = default);
    Task<IReadOnlyList<CodingTask>> GetAllAsync(CancellationToken ct = default);
    Task<CodingTask?> FindByIdAsync(Guid id, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);

    Task <CodingTask?> GetByIdWithInvocationsAsync(Guid id, CancellationToken ct = default);

    Task AddInvocation(TaskInvocation taskInvocation, CancellationToken ct = default);
    Task<TaskInvocation?> GetInvocations(Guid id, CancellationToken ct = default);
  }
}
