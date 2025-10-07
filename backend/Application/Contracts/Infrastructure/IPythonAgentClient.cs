using Masal.Application.DTOs;
namespace Masal.Application.Contracts.Infrastructure
{
    public interface IPythonAgentClient
    {
        
        Task<Dictionary<string, List<string>>> GenerateActivityWordsAsync(
            string question,
            string? logicRule,
            List<string> categories);

        Task<EvaluateAnswerResultDto> EvaluateAnswerAsync(EvaluateAnswerRequestDto request);
        Task<GeneratePromptResultDto> GeneratePromptAsync(GeneratePromptRequestDto request);
        Task<GenerateImageResultDto> GenerateImageAsync(GenerateImageRequestDto request);
    }
}
