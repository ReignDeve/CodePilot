using Microsoft.SemanticKernel;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SemanticKernel.Abstractions;
using SemanticKernel.Services;

namespace SemanticKernel.DependencyInjection
{
  public static class SemanticKernelExtensions
  {
    /// <summary>
    /// Registriert Semantic-Kernel sowie alle entsprechenden Dienste.
    /// </summary>
    public static IServiceCollection AddSemanticKernel(this IServiceCollection services,
                                                       IConfiguration configuration)
    {
      // 1) Kernel-Instanz als Singleton
      services.AddSingleton<Kernel>(_ =>
      {
        var builder = Kernel.CreateBuilder();

        // Beispiel: OpenAI / Azure OpenAI – falls nötig anpassen
        builder.AddOpenAIChatCompletion(
            modelId: configuration["OpenAI:Model"] ?? "gpt-3.5-turbo",
            apiKey: configuration["OpenAI:ApiKey"] ?? throw new InvalidOperationException(
                        "OPENAI_API_KEY fehlt im Configuration-Store"));

        return builder.Build();
      });

      // 2) Anwendungsspezifische Services
      services.AddSingleton<IExplainService, ExplainService>();

      return services;
    }
  }
}
