using Masal.Application.DTOs;
using MediatR;

namespace Masal.Application.Features.Books.Queries.GetBookPage
{
    // RequestDto'yu doğrudan Query olarak kullanmak yaygın bir yaklaşımdır.
    public class GetBookPageQuery : GetBookPageRequestDto, IRequest<GetBookPageResponseDto>
    {
        // GetBookPageRequestDto içindeki BookId, CurrentPageNumber ve Direction
        // property'lerini miras alır.
    }
}
