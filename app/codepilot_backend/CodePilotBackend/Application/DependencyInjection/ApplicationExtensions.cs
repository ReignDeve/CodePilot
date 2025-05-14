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
      // Semantic Kernel (oder andere Application-Singletons)
      services.AddSingleton(sp =>
      {
        var builder = Kernel.CreateBuilder();
        builder.AddOpenAIChatCompletion(cfg["OpenAI:Model"]!,
                                        cfg["OpenAI:ApiKey"]!);
        return builder.Build();
      });

      services.AddScoped<IExplainService, ExplainService>();
      return services;
    }
  }
}
