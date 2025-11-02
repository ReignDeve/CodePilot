namespace CodePilot.Backend.WebAPI.Models
{
  public sealed record GetTasks
  (
    Guid Id,
    string Title,
    string Status,
    string Difficulty,
    string Code,
    string ExternalId,
    string Description,
    string Solution,
    string[] Invocations
  );
}
