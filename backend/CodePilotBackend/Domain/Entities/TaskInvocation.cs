using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
  public class TaskInvocation
  {
    public Guid Id { get; init; } = Guid.NewGuid();

    // FK
    public Guid CodingTaskId { get; set; }

    // Der eigentliche Aufruf, z. B. "new[]{5,10,15}"
    public string Value { get; set; } = string.Empty;

    // Optional: Reihenfolge bewahren
    public int Order { get; set; }
  }
}
