
namespace Masal.Application.DTOs
{
    public class ActivityWordCategoryDetailDto
    {
        // WordCategory entity'sinden CategoryName
        public string CategoryName { get; set; } = default!;
        // YENİ ALAN: Bu kelimelerin dinamik olarak mı üretilmesi gerekiyor?
        public bool IsDynamic { get; set; }
        // Kategoriye ait kelimeler (Word entity'sinden WordText)
        public List<string> Words { get; set; } = new();
    }
}
