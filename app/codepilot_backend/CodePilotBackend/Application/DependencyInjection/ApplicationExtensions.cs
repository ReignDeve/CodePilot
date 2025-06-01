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
      // Basis = …/bin/Debug/net8.0/
      var baseDir = AppContext.BaseDirectory;

      // Ordner, in dem plugin.config.json liegt
      var pluginDir = Path.Combine(baseDir, "Plugins", "Explain");

      // Semantic Kernel (oder andere Application-Singletons)
      services.AddSingleton(sp =>
      {
        var builder = Kernel.CreateBuilder();
        builder.AddOpenAIChatCompletion(cfg["OpenAI:Model"]!,
                                        cfg["OpenAI:ApiKey"]!)
                .Plugins.AddFromPromptDirectory(pluginDir);
        return builder.Build();
      });

      services.AddSingleton<ICodeTutor, CodeTutor>();
      services.AddScoped<IExplainService, ExplainService>();
      services.AddScoped<IAuthService, AuthService>();
      return services;
    }
  }
}
