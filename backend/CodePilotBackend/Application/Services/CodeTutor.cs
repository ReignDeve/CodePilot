using Application.Interfaces;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
  public sealed class CodeTutor : ICodeTutor
  {
    private readonly Kernel _kernel;
    private readonly KernelFunction _explain;
    private readonly KernelFunction _krFeedback;
    private readonly KernelFunction _kmFeedback;
    private readonly KernelFunction _khFeedback;
    private readonly KernelFunction _question;
    private readonly IUserRepository _users;
    private readonly OpenAIPromptExecutionSettings _defaultSettings;

    public CodeTutor(Kernel kernel, IUserRepository users)
    {
      _kernel = kernel;

      _explain = _kernel.Plugins["ExplainPlugin"]["ExplainExercise"];
      _krFeedback = _kernel.Plugins["ExplainPlugin"]["KRFeedback"];
      _kmFeedback = _kernel.Plugins["ExplainPlugin"]["KMFeedback"];
      _khFeedback = _kernel.Plugins["ExplainPlugin"]["KHFeedback"];
      _question = _kernel.Plugins["ExplainPlugin"]["Question"];
      _users = users;


      _defaultSettings = new OpenAIPromptExecutionSettings
      {
        Temperature = 1.0, //Nicht anpassbar
        // <<< Dein globaler System-Prompt neu angepasst mit Iteration 3 >>>
        ChatSystemPrompt = """
        Du bist ein Informatik-Dozent und gibst lernförderndes, schrittweises Feedback zu Programmieraufgaben.

        Rolle:
        Du hilfst Lernenden dabei, fehlerhaften Code zu verstehen und zu korrigieren.
        Dabei konzentrierst du dich ausschließlich auf die funktionale Korrektheit – also darauf, dass das Programm alle Anforderungen der Aufgabenstellung erfüllt. 
        Deine Aufgabe ist es, Feedback zu geben, das den Lernenden beim eigenständigen Verbessern des Codes unterstützt.
        Regeln für alle Feedbackarten:
        - Antworte ausschließlich auf Deutsch.
        - Verwende eine klare, strukturierte Sprache mit kurzen Absätzen oder Bulletpoints.
        - Kommentiere nur funktionale Fehler, keine Stilfragen oder  Formatierung.
        - Fördere Eigenständigkeit – leite die Lernenden an, anstatt fertige       Lösungen zu liefern.
        - Verwende Codebeispiele nur, wenn sie didaktisch notwendig sind, und kennzeichne sie mit csharp.
        - Stelle deine Antwort immer als Markdown bereit
        Ziel:
        Dein Feedback soll meaningful, exact und useful sein – also klar, konkret und lernwirksam.
        """
      };
    }

    private KernelArguments MakeArgs(Action<OpenAIPromptExecutionSettings>? tweak = null)
    {
      var settings = new OpenAIPromptExecutionSettings
      {
        Temperature = _defaultSettings.Temperature,
        ChatSystemPrompt = _defaultSettings.ChatSystemPrompt,
        TopP = _defaultSettings.TopP,
        MaxTokens = _defaultSettings.MaxTokens,
        PresencePenalty = _defaultSettings.PresencePenalty,
        FrequencyPenalty = _defaultSettings.FrequencyPenalty
      };
      tweak?.Invoke(settings);
      return new KernelArguments(settings);
    }

    public async Task<string> ExplainWithContextAsync(
      Guid userId,
        string code,
        string question,
        string description,
        CancellationToken ct = default)
    {
      var preferences = await _users.GetLearningPreferencesAsync(userId, ct).ConfigureAwait(false);

      var args = MakeArgs();
      args["code"] = code;
      args["question"] = question;
      args["description"] = description;
      args["preferences"] = preferences;

      var result = await _kernel.InvokeAsync(_question, args, ct);
      return result.GetValue<string>() ?? string.Empty;
    }

    public async Task<string> ExplainTaskAsync(
      Guid userId,
        string code,
        string description,
        CancellationToken ct = default)
    {
      var preferences = await _users.GetLearningPreferencesAsync(userId, ct).ConfigureAwait(false);

      var args = MakeArgs();
      args["code"] = code;
      args["description"] = description;
      args["preferences"] = preferences;

      var result = await _kernel.InvokeAsync(_explain, args, ct);
      return result.GetValue<string>() ?? string.Empty;
    }


    public async Task<string> KRFeedbackAsync(
      Guid userId,
            string code,
            string description,
            CancellationToken ct = default)
    {
      var preferences = await _users.GetLearningPreferencesAsync(userId, ct).ConfigureAwait(false);

      var args = MakeArgs();
      args["code"] = code;
      args["description"] = description;
      args["preferences"] = preferences;

      var result = await _kernel.InvokeAsync(_krFeedback, args, ct);
      return result.GetValue<string>() ?? string.Empty;
    }

    public async Task<string> KMFeedbackAsync(
      Guid userId,
      string code,
        string description,
        CancellationToken ct = default)
    {
      var preferences = await _users.GetLearningPreferencesAsync(userId, ct).ConfigureAwait(false);
      var args = MakeArgs();
      args["code"] = code;
      args["description"] = description;
      args["preferences"] = preferences;

      var result = await _kernel.InvokeAsync(_kmFeedback, args, ct);
      return result.GetValue<string>() ?? string.Empty;
    }

    public async Task<string> KHFeedbackAsync(
      Guid userId,
        string code,
        string description,
        CancellationToken ct = default)
    {
      var preferences = await _users.GetLearningPreferencesAsync(userId, ct).ConfigureAwait(false);
      var args = MakeArgs();
      args["code"] = code;
      args["description"] = description;
      args["preferences"] = preferences;

      var result = await _kernel.InvokeAsync(_khFeedback, args, ct);
      return result.GetValue<string>() ?? string.Empty;
    }

    public async Task<string> GetPreferencesAsync(Guid userId, CancellationToken ct)
    {
      return await _users.GetLearningPreferencesAsync(userId, ct).ConfigureAwait(false);
    }
  }
}
