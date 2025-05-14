using CodePilot.Persistence.Db;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence.Repositories;

namespace Persistence.DependencyInjection
{
  public static class PersistenceExtensions
  {
    public static IServiceCollection AddPersistence(this IServiceCollection services,
                                                    IConfiguration cfg)
    {
      var conn = cfg.GetConnectionString("Default") ?? "Data Source=codepilot.db";

      services.AddDbContext<CodePilotDbContext>(opt => opt.UseSqlite(conn));

      services.AddScoped<ITaskRepository, TaskRepository>();
      return services;
    }
  }
}
