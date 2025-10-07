namespace Masal.Infrastructure.Services.PythonAgentService
{
    public class PythonAgentSettings
    {
        // appsettings.json dosyasındaki "PythonAgentSettings" bölümüne karşılık gelir
        public string BaseUrl { get; set; } = string.Empty;
        public string GenerateWordsEndpoint { get; set; } = "/api/agent/generate-words";
        public string EvaluateEndpoint { get; set; } = "/api/agent/evaluate";
        public string GeneratePromptEndpoint { get; set; } = "/api/agent/generate-prompt";
        public string GenerateImageEndpoint { get; set; } = "/api/agent/generate-image";
    }
}
