using Domain.Enums;

namespace Domain.Entities
{
  public class UserTaskProgress
  {
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid UserId { get; init; }
    public Guid TaskId { get; init; }
    public Domain.Enums.TaskStatus Status { get; private set; } = Domain.Enums.TaskStatus.NotStarted;

    public static UserTaskProgress Create(Guid userId, Guid taskId)
        => new() { UserId = userId, TaskId = taskId };

    public void SetStatus(Domain.Enums.TaskStatus st) => Status = st;
  }
}
