namespace Masal.Application.Contracts.Infrastructure
{
    public interface IImageGenerationService
    {
        Task<string> GenerateImageAsync(string prompt);
    }
}
