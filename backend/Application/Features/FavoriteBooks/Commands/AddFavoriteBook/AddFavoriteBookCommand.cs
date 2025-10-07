using Masal.Application.DTOs;
using MediatR;

namespace Masal.Application.Features.FavoriteBooks.Commands.AddFavoriteBook
{
    public class AddFavoriteBookCommand : IRequest<FavoriteBookResponseDto>
    {
        public AddFavoriteBookRequestDto Request { get; set; }

        public AddFavoriteBookCommand(AddFavoriteBookRequestDto request)
        {
            Request = request;
        }
    }
}
