namespace Masal.Application.DTOs
{
    
    public class PageContentDto
    {
        // BaseImageURL'u kullanabiliriz.
        public string ImageURL { get; set; } = default!;

        // PageContent entity'sinden gelen metin
        public string TextContent { get; set; } = default!;
    }
}
