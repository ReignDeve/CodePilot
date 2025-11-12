using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace CodePilot.Backend.WebAPI.Models
{
  public class SummaryRequest 
  {
    public required string Difficulty { get; set; }
    public required string Problems { get; set; }
    public required string Expectations { get; set; }
    public required string LearningStyle { get; set; }
    public required List<MotivationType> Motivation { get; set; } = new();
    public string? MotivationOther { get; set; }
    public required string ProblemSolving { get; set; }
  }

  [JsonConverter(typeof(JsonStringEnumConverter))]
  public enum MotivationType
  {
    Fun,
    Knowledge,
    Grades,
    Career
  }
}
