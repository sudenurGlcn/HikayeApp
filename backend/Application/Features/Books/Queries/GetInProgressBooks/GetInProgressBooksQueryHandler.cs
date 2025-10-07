using Masal.Application.DTOs;
using Masal.Application.DTOs.Masal.Application.DTOs;
using Masal.Domain.Interfaces;
using MediatR;

namespace Masal.Application.Features.Books.Queries.GetInProgressBooks
{
    public class GetInProgressBooksQueryHandler : IRequestHandler<GetInProgressBooksQuery, List<BookWithProgressDto>>
    {
        private readonly IReadingProgressRepository _readingProgressRepository;

        public GetInProgressBooksQueryHandler(IReadingProgressRepository readingProgressRepository)
        {
            _readingProgressRepository = readingProgressRepository;
        }

        public async Task<List<BookWithProgressDto>> Handle(GetInProgressBooksQuery request, CancellationToken cancellationToken)
        {
            return await _readingProgressRepository.GetInProgressBooksWithProgressByChildIdAsync(request.ChildId);
 }
}
}