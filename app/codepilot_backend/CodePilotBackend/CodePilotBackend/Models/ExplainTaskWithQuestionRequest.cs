namespace CodePilot.Backend.WebAPI.Models
{
  public class ExplainTaskWithQuestionRequest
  {
    public required Guid TaskId { get; set; }
    public required string Code { get; set; }
    public required string Question { get; set; }
  }
}
