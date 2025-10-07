namespace Masal.Application.DTOs
{
    public class GenerateWordsResultDto
    {
        public Dictionary<string, List<string>> Words { get; set; } = new();
    }
}
