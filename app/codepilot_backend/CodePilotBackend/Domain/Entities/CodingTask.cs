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


    public static CodingTask Create(
        string title,
        string code,
        string description,
        Difficulty difficulty,
        string solution = "")
        => new()
        {
          Title = title,
          Code = code,
          Description = description,
          Difficulty = difficulty,
          Solution = solution
        };

    public void SetStatus(Enums.TaskStatus newStatus)
    {
      Status = newStatus;
    }

    public void Complete(string finalSolution)
    {
      Solution = finalSolution;
      Status = Enums.TaskStatus.Completed;
    }
  }
}
