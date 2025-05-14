using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.SemanticKernel;
using Microsoft.Extensions.Logging;


namespace SemanticKernel
{
  public static class KernelServiceCollectionExtensions
  {
    public static IServiceCollection AddSemanticKernel(this IServiceCollection services, IConfiguration cfg)
    {
      services.AddSingleton(sp =>
      {
        var builder = Kernel.CreateBuilder();

        builder.AddOpenAIChatCompletion(
            modelId: cfg["OpenAI:Model"],
                apiKey: cfg["OpenAI:ApiKey"]);

        return builder.Build();
      });

      return services;
    }
  }

}
