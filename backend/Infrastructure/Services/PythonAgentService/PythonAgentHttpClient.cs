using Masal.Application.Contracts.Infrastructure;
using System.Text.Json;
using System.Text;
using Microsoft.Extensions.Options;
using Masal.Application.DTOs;

namespace Masal.Infrastructure.Services.PythonAgentService
{
    // Arayüz adı, temsil ettiği ajanı daha iyi yansıtacak şekilde güncellenebilir (örneğin IGeminiWordAgentClient).
    public class PythonAgentHttpClient : IPythonAgentClient
    {
        private readonly HttpClient _httpClient;
        private readonly PythonAgentSettings _settings;
        private readonly ILogger<PythonAgentHttpClient> _logger;

        public PythonAgentHttpClient(HttpClient httpClient, IOptions<PythonAgentSettings> settings, ILogger<PythonAgentHttpClient> logger)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
            _logger = logger;
            if (!string.IsNullOrEmpty(_settings.BaseUrl))
            {
                _httpClient.BaseAddress = new Uri(_settings.BaseUrl);
            }
        }

        public async Task<Dictionary<string, List<string>>> GenerateActivityWordsAsync(
            string question,
            string? logicRule,
            List<string> categories)
        {
            var requestBody = new
            {
                activityQuestion = question,
                validationLogic = logicRule ?? "No specific logic, generate fun, random words.",
                categoriesToGenerate = categories
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync(_settings.GenerateWordsEndpoint, jsonContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Python Agent isteği başarısız oldu. Durum: {StatusCode}, Yanıt: {ErrorContent}", response.StatusCode, errorContent);
                throw new HttpRequestException($"Python Agent isteği başarısız oldu. Durum: {response.StatusCode}, Yanıt: {errorContent}");
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();

            // ================= KRİTİK LOGLAMA =================
            // Python'dan gelen ham JSON yanıtını logla. Bu, sorunun kaynağını bulmamıza yardımcı olacak.
            _logger.LogInformation("Python Agent'dan gelen ham JSON yanıtı: {JsonResponse}", jsonResponse);
            // ==================================================

            var result = JsonSerializer.Deserialize<GenerateWordsResponseDto>(jsonResponse, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return result?.Words ?? new Dictionary<string, List<string>>();
        }


        private async Task<TOut> PostJsonAsync<TIn, TOut>(string url, TIn body)
        {
            var json = JsonSerializer.Serialize(body);
            _logger.LogInformation("PythonAgent çağrısı: {Url} - Payload: {Payload}", url, json);

            var response = await _httpClient.PostAsync(url, new StringContent(json, Encoding.UTF8, "application/json"));
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("PythonAgent hatası. URL: {Url}, Status: {Status}, Body: {Body}", url, response.StatusCode, responseBody);
                throw new HttpRequestException($"PythonAgent çağrısı başarısız: {url} - {response.StatusCode} - {responseBody}");
            }

            return JsonSerializer.Deserialize<TOut>(responseBody, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
        }

        public Task<EvaluateAnswerResultDto> EvaluateAnswerAsync(EvaluateAnswerRequestDto request) =>
            PostJsonAsync<EvaluateAnswerRequestDto, EvaluateAnswerResultDto>(_settings.EvaluateEndpoint, request);

        public Task<GeneratePromptResultDto> GeneratePromptAsync(GeneratePromptRequestDto request) =>
            PostJsonAsync<GeneratePromptRequestDto, GeneratePromptResultDto>(_settings.GeneratePromptEndpoint, request);

        public Task<GenerateImageResultDto> GenerateImageAsync(GenerateImageRequestDto request) =>
            PostJsonAsync<GenerateImageRequestDto, GenerateImageResultDto>(_settings.GenerateImageEndpoint, request);
    }

    public class GenerateWordsResponseDto
    {
        public Dictionary<string, List<string>> Words { get; set; } = new Dictionary<string, List<string>>();
    }
}
