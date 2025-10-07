using Masal.Domain.Interfaces;
using MediatR;

namespace Masal.Application.Features.ReadingProgresses.Commands.CompleteBook
{
    public class CompleteBookCommandHandler : IRequestHandler<CompleteBookCommand, bool>
    {
        private readonly IReadingProgressRepository _readingProgressRepository;

        public CompleteBookCommandHandler(IReadingProgressRepository readingProgressRepository)
        {
            _readingProgressRepository = readingProgressRepository;
        }

        public async Task<bool> Handle(CompleteBookCommand request, CancellationToken cancellationToken)
        {
            // Kitabı tamamla
            var result = await _readingProgressRepository.CompleteBookAsync(request.ChildId, request.BookId);
            return result;
        }
    }
}
