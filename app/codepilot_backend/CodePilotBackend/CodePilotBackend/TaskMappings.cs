using CodePilot.Backend.WebAPI.Models;
using Domain.Entities;

namespace CodePilot.Backend.WebAPI
{
  public static class TaskMappings
  {
    public static GetTasks ToDto(this CodingTask t) => new(
        t.Id, t.Title, t.Status.ToString(), t.Difficulty.ToString(),
        t.Code, t.Description, t.Solution);
  }

}
