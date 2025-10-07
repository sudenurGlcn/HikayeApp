using Masal.Application.DTOs;
using MediatR;

namespace Masal.Application.Features.Books.Queries.GetLatestBooks
{
    public class GetLatestBooksQuery : IRequest<List<BookHomeDto>>
    {
        public int Count { get; set; } = 8; // Varsayılan olarak 8 kitap döndür
    }
}
