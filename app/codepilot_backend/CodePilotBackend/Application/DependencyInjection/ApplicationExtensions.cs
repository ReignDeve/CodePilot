using Application.Interfaces;
using Application.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.SemanticKernel;


namespace Application.DependencyInjection
{
  public static class ApplicationExtensions
  {
    public static IServiceCollection AddApplication(this IServiceCollection services,
                                                    IConfiguration cfg)
    {

      services.AddSingleton(sp =>
      {
        var builder = Kernel.CreateBuilder();
        builder
          .AddOpenAIChatCompletion(
              cfg["OpenAI:Model"]!,
              cfg["OpenAI:ApiKey"]!
          );
        var baseDir = AppContext.BaseDirectory;
        var root = Path.Combine(baseDir, "Plugins");

        if (Directory.Exists(root))
        {
          foreach (var pluginDir in Directory.GetDirectories(root))
          {
            Console.WriteLine($"→ Loading SK plugin from {pluginDir}");
            try
            {
              builder.Plugins.AddFromPromptDirectory(pluginDir);
              // Note: GetPlugins is not available here, so we’ll check after build
            }
            catch (Exception ex)
            {
              Console.WriteLine($"→ Failed to load plugin from {pluginDir}: {ex.Message}");
            }
          }
      }

        return builder.Build();
      });

      services.AddSingleton<ICodeTutor, CodeTutor>();
      services.AddScoped<IExplainService, ExplainService>();
      services.AddScoped<IAuthService, AuthService>();
      return services;
    }
  }
}
