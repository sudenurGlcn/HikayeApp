using Masal.Application.DTOs;
using Masal.Application.DTOs.Masal.Application.DTOs;
using MediatR;

namespace Masal.Application.Features.Books.Queries.GetInProgressBooks
{
    public record GetInProgressBooksQuery(int ChildId) : IRequest<List<BookWithProgressDto>>;
}