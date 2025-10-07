using Masal.Application.Contracts.Infrastructure;
using Masal.Application.DTOs;
using Masal.Domain.Entities;
using Masal.Domain.Interfaces;

namespace Masal.Infrastructure.Services
{
    public class AgentOrchestrationService
    {
        private readonly IPythonAgentClient _pythonClient;
        private readonly IActivityResponseRepository _responseRepo;
        private readonly IGeneratedImageRepository _imageRepo;
        private readonly IActivityRepository _activityRepo;
        private readonly ILogger<AgentOrchestrationService> _logger;

        public AgentOrchestrationService(
            IPythonAgentClient pythonClient,
            IActivityResponseRepository responseRepo,
            IGeneratedImageRepository imageRepo,
            IActivityRepository activityRepo,
            ILogger<AgentOrchestrationService> logger)
        {
            _pythonClient = pythonClient;
            _responseRepo = responseRepo;
            _imageRepo = imageRepo;
            _activityRepo = activityRepo;
            _logger = logger;
        }

        public async Task<(bool isCorrect, string feedback, string imageUrl)> ProcessActivityResponseAsync(
            int childId,
            int activityId,
            string userAnswer)
        {
            // 1) Activity bilgilerini veritabanından çek
            var activity = await _activityRepo.GetByIdAsync(activityId);
            if (activity == null)
                throw new KeyNotFoundException($"ActivityId {activityId} bulunamadı.");

            var activityQuestion = activity.QuestionText;
            var logicRule = activity.LogicalValidationRule;

            // BaseImageUrl: Activity -> Page -> BaseImageURL
            var baseImageUrl = activity.Page?.BaseImageURL;

            // 1) Evaluate
            var evalReq = new EvaluateAnswerRequestDto
            {
                ActivityQuestion = activityQuestion,
                ValidationLogic = logicRule,
                UserAnswer = userAnswer
            };
            var evalRes = await _pythonClient.EvaluateAnswerAsync(evalReq);

            // 2) Generate prompt for image
            var promptReq = new GeneratePromptRequestDto
            {
                ActivityQuestion = activityQuestion,
                UserAnswer = userAnswer,
                IsCorrect = evalRes.IsCorrect,
                GeminiFeedback = evalRes.GeminiFeedback,
                BaseImageUrl = baseImageUrl
            };
            var promptRes = await _pythonClient.GeneratePromptAsync(promptReq);

            // 3) Generate image
            var imgReq = new GenerateImageRequestDto
            {
                Prompt = promptRes.PromptText,
                NumImages = 1,
                OutputFormat = "jpeg"
            };

            if (!string.IsNullOrEmpty(baseImageUrl))
            {
                imgReq.ImageUrls = new List<string> { baseImageUrl };
            }

            var imgRes = await _pythonClient.GenerateImageAsync(imgReq);

            var imageUrl = imgRes.Images.FirstOrDefault()?.Url ?? string.Empty;

            // 4) Save ActivityResponse
            var activityResponse = new ActivityResponse
            {
                ChildId = childId,
                ActivityId = activityId,
                ResponseText = userAnswer,
                IsLogicallyCorrect = evalRes.IsCorrect,
                GeminiFeedback = evalRes.GeminiFeedback,
                ResponseTimestamp = DateTime.UtcNow
            };
            await _responseRepo.AddAsync(activityResponse);
            await _responseRepo.SaveChangesAsync();

            // 5) Save GeneratedImage
            if (!string.IsNullOrEmpty(imageUrl))
            {
                var genImage = new GeneratedImage
                {
                    ResponseId = activityResponse.Id,
                    ImageURL = imageUrl,
                    PromptText = promptRes.PromptText,
                    CreatedAt = DateTime.UtcNow
                };
                await _imageRepo.AddAsync(genImage);
                await _imageRepo.SaveChangesAsync();
            }

            // 6) Return result
            return (evalRes.IsCorrect, evalRes.GeminiFeedback, imageUrl);
        }
    }
}
