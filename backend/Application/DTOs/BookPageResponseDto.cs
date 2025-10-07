namespace Masal.Application.DTOs
{
    /// <summary>
    /// Bir kitabın belirli bir sayfasının içeriğini frontend'e göndermek için kullanılır.
    /// </summary>
    public class BookPageResponseDto
    {
        
        public int PageNumber { get; set; }

        
        public required string PageType { get; set; }

        
        public string? TextContent { get; set; }

    
        public string? ImageUrl { get; set; }
    }
}
