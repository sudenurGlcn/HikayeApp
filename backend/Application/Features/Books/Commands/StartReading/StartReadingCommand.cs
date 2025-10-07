using Masal.Application.DTOs;
using MediatR;

namespace Masal.Application.Features.Books.Commands.StartReading
{
    // Kitaba başlama komutu. Yanıt olarak ilk sayfa içeriğini döndürmek için BookPageResponseDto kullanır.
    public class StartReadingCommand : IRequest<GetBookPageResponseDto>
    {
        public int ChildId { get; set; }
        public int BookId { get; set; }

        public StartReadingCommand(int childId, int bookId)
        {
            ChildId = childId;
            BookId = bookId;
        }
    }
}
