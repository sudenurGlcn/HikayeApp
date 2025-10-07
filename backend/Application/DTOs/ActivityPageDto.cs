namespace Masal.Application.DTOs
{
    /// <summary>
    /// Etkinlik (Activity) tipi bir sayfanın detaylarını taşır.
    /// </summary>
    public class ActivityPageDto
    {
        public int ActivityId { get; set; }
        // Page entity'sinden gelen resim (BaseImageURL)
        public string ImageURL { get; set; } = default!;

        // Activity entity'sinden gelen soru metni
        public string QuestionText { get; set; } = default!;

        // Etkinliğe ait kelime kategorileri ve içerikleri
        public List<ActivityWordCategoryDetailDto> WordCategories { get; set; } = new();

        
    }
}
