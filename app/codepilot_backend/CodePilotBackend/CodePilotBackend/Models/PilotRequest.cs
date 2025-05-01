using Microsoft.AspNetCore.Mvc;

namespace CodePilot.Backend.WebAPI.Models
{
  public class PilotRequest 
  {
    public required string Code { get; set; }
    public required string Question { get; set; }
   
  }
}
