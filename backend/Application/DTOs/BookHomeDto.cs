namespace Masal.Application.DTOs
{
    public class BookHomeDto
    {
        public int Id { get; set; }              // Kitabın Id'si (frontend routing veya detay sayfası için gerekli olabilir)
        public string Title { get; set; } = default!; // Kitap başlığı
        public string CoverImageURL { get; set; } = default!; // Kapak görseli
        public List<string> Authors { get; set; } = new();    // Yazar isimleri (birden fazla olabilir)
    }
}
