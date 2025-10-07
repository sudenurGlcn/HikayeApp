using MediatR;

namespace Masal.Application.Features.ReadingProgresses.Commands.CompleteBook
{
    public class CompleteBookCommand : IRequest<bool>
    {
        public int ChildId { get; set; }
        public int BookId { get; set; }

        public CompleteBookCommand(int childId, int bookId)
        {
            ChildId = childId;
            BookId = bookId;
        }
    }
}
