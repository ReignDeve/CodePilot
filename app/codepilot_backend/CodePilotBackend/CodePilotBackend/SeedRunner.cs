using Domain.Repositories;
using Persistence.DB;

namespace CodePilot.Backend.WebAPI
{
  public sealed class SeedRunner : IHostedService
  {
    private readonly IServiceProvider _sp;
    public SeedRunner(IServiceProvider sp) => _sp = sp;

    public async Task StartAsync(CancellationToken ct)
    {
      Console.WriteLine("▶ SeedRunner gestartet");              

      using var scope = _sp.CreateScope();
      var repo = scope.ServiceProvider.GetRequiredService<ITaskRepository>();

      await TaskSeeder.RunAsync(repo, ct);                      

      Console.WriteLine("✔ SeedRunner fertig");
    }

    public Task StopAsync(CancellationToken _) => Task.CompletedTask;
  }
}
