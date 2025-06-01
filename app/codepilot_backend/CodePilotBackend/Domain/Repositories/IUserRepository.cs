using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Repositories
{
  public interface IUserRepository
  {
    Task AddAsync(User user, CancellationToken ct = default);
    Task<User?> FindByNameAsync(string userName, CancellationToken ct = default);
    Task<User?> FindByIdAsync(Guid id, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
  }
}
