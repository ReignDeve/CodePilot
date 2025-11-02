using Domain.Enums;


namespace Domain.Entities
{
  public class CodingTask
  {
    public Guid Id { get; init; } = Guid.NewGuid();
    public string ExternalId { get; set; } = "";
    public Enums.TaskStatus Status { get; private set; } = Enums.TaskStatus.NotStarted;
    public string Title { get; private set; } = "";
    public Difficulty Difficulty { get; private set; } = Difficulty.Easy;
    public string Solution { get; private set; } = "";
    public string Code { get; private set; } = "";
    public string Description { get; private set; } = "";
    public Guid InvocationId { get; init; } = Guid.NewGuid();

    // statt string[] jetzt 1-n Navigation
    public ICollection<TaskInvocation> Invocations { get; private set; } = new List<TaskInvocation>();

    public static CodingTask Create(
      string title,
      string code,
      string description,
      Difficulty difficulty,
      IEnumerable<string> invocations,
      string solution = "")
    {
      var task = new CodingTask
      {
        Title = title,
        Code = code,
        Description = description,
        Difficulty = difficulty,
        Solution = solution
      };

      int i = 0;
      foreach (var v in invocations ?? Array.Empty<string>())
      {
        task.Invocations.Add(new TaskInvocation
        {
          Value = v,
          Order = i++
        });
      }

      return task;
    }

    public void SetStatus(Enums.TaskStatus newStatus) => Status = newStatus;

    public void Complete(string finalSolution)
    {
      Solution = finalSolution;
      Status = Enums.TaskStatus.Completed;
    }

    public void ReplaceInvocations(IEnumerable<string> invocations)
    {
      Invocations.Clear();
      int i = 0;
      foreach (var v in invocations ?? Array.Empty<string>())
      {
        Invocations.Add(new TaskInvocation { Value = v, Order = i++ });
      }
    }
  }
}
