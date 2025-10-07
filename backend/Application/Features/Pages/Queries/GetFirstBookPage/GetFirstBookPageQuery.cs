using Masal.Application.DTOs;
using MediatR;

namespace Masal.Application.Features.Pages.Queries.GetFirstBookPage
{
    // Kitabın ilk sayfasını getirme sorgusu
    public class GetFirstBookPageQuery : IRequest<BookPageResponseDto>
    {
        public int BookId { get; set; }

        public GetFirstBookPageQuery(int bookId)
        {
            BookId = bookId;
        }
    }
}
