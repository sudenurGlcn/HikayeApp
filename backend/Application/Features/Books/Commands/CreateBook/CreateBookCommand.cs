using MediatR;

namespace Masal.Application.Features.Books.Commands.CreateBook
{
    public class CreateBookCommand : IRequest<int>
    {
        public string Title { get; set; } = default!;
        public string? Description { get; set; }
        public string CoverImageURL { get; set; } = default!;
        public string? Topic { get; set; }
        public int? EstimatedReadingTimeMinutes { get; set; }
        public int? ActivityCount { get; set; }
        public bool IsPublished { get; set; } = false;

        // İsteğe bağlı: Yazar Id’leri (kitap-yazar ilişkisi kurmak için)
        public List<int> AuthorIds { get; set; } = new();
    }
}
