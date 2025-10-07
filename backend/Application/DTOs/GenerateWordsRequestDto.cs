namespace Masal.Application.DTOs
{
    public class GenerateWordsRequestDto
    {
        public string ActivityQuestion { get; set; } = string.Empty;
        public string? ValidationLogic { get; set; }
        public List<string> CategoriesToGenerate { get; set; } = new();
    }
}
