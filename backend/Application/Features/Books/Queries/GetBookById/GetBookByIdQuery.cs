using Masal.Application.DTOs;
using MediatR;

namespace Masal.Application.Features.Books.Queries.GetBookById
{
    public class GetBookByIdQuery : IRequest<BookDetailDto>
    {
        public int Id { get; set; }

        public GetBookByIdQuery(int id)
        {
            Id = id;
        }
    }
}
