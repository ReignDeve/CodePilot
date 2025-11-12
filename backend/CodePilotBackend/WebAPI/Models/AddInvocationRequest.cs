using Domain.Entities;

namespace CodePilot.Backend.WebAPI.Models
{
  public sealed record AddInvocationRequest
  (
      Guid Id, 
      Guid CodingID, 
      string Value,
      int Order
  );

}
