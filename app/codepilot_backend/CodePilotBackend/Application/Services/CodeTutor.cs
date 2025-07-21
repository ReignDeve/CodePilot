using Application.Interfaces;
using Microsoft.SemanticKernel;
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

        public CodeTutor(Kernel kernel)
        {
            _kernel = kernel;

            _explain = _kernel.Plugins["ExplainPlugin"]["ExplainExercise"];
            _krFeedback = _kernel.Plugins["ExplainPlugin"]["KRFeedback"];
            _kmFeedback = _kernel.Plugins["ExplainPlugin"]["KMFeedback"];
            _khFeedback = _kernel.Plugins["ExplainPlugin"]["KHFeedback"];
        }

        public async Task<string> ExplainWithContextAsync(
            string code,
            string description,
            CancellationToken ct = default)
        {
            var args = new KernelArguments
            {
                ["code"] = code,
                ["description"] = description
            };

            var result = await _kernel.InvokeAsync(_explain, args, ct);
            return result.GetValue<string>() ?? string.Empty;
        }

        public async Task<string> KRFeedbackAsync(
            string code,
            string description,
            CancellationToken ct = default)
        {
            var args = new KernelArguments
            {
                ["code"] = code,
                ["description"] = description
            };
            var result = await _kernel.InvokeAsync(_krFeedback, args, ct);
            return result.GetValue<string>() ?? string.Empty;
        }

        public async Task<string> KMFeedbackAsync(
            string code,
            string description,
            CancellationToken ct = default)
        {
            var args = new KernelArguments
            {
                ["code"] = code,
                ["description"] = description
            };
            var result = await _kernel.InvokeAsync(_kmFeedback, args, ct);
            return result.GetValue<string>() ?? string.Empty;
        }

        public async Task<string> KHFeedbackAsync(
            string code,
            string description,
            CancellationToken ct = default)
        {
            var args = new KernelArguments
            {
                ["code"] = code,
                ["description"] = description
            };
            var result = await _kernel.InvokeAsync(_khFeedback, args, ct);
            Console.WriteLine($"Invocation completed, result: {result.GetValue<string>()}");
            return result.GetValue<string>() ?? string.Empty;
        }
    }
}
