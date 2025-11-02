using Domain.Entities;
using Domain.Enums;
using Domain.Repositories;
using System.Text.Json;

namespace Persistence.DB
{
  public static class TaskSeeder
  {
    private static readonly string SeedPath =
    Path.Combine(AppContext.BaseDirectory, "Seed", "tasks.seed.json");

    public static async Task RunAsync(ITaskRepository repo, CancellationToken ct = default)
    {
      Console.WriteLine($"🌱 TaskSeeder → looking for: {SeedPath}");
      if (!File.Exists(SeedPath)) { Console.WriteLine("🚫 Seed-Datei NICHT gefunden – Seeder beendet."); return; }
      Console.WriteLine("✅ Seed-Datei gefunden!");

      using var stream = File.OpenRead(SeedPath);
      var seedTasks = await JsonSerializer.DeserializeAsync<List<SeedDto>>(stream, new JsonSerializerOptions
      {
        PropertyNameCaseInsensitive = true
      }, ct) ?? new();

      var existing = (await repo.GetAllAsync(ct))
                     .ToDictionary(t => t.ExternalId, StringComparer.OrdinalIgnoreCase);

      foreach (var dto in seedTasks)
      {
        if (existing.TryGetValue(dto.uid, out var current))
        {
          // aktuell überspringst du existierende — ggf. hier aktualisieren, falls gewünscht
          continue;
        }

        var entity = CodingTask.Create(
          title: dto.title,
          code: dto.code,
          description: dto.description,
          difficulty: Enum.Parse<Difficulty>(dto.difficulty, true),
          invocations: dto.invocations ?? new List<string>(),   // <—
          solution: dto.solution
        );

        entity.ExternalId = dto.uid;
        entity.SetStatus(Enum.Parse<Domain.Enums.TaskStatus>(dto.status, true));
        await repo.AddAsync(entity, ct);
      }

      await repo.SaveChangesAsync(ct);
    }

    private sealed record SeedDto(
  string uid,
  string status,
  string title,
  string difficulty,
  string solution,
  string code,
  string description,
  List<string> invocations // <— war string, jetzt Array/Liste
);
  }
}
