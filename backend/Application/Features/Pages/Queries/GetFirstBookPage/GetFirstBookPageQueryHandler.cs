using AutoMapper;
using Masal.Application.DTOs;
using Masal.Domain.Interfaces;
using MediatR;

namespace Masal.Application.Features.Pages.Queries.GetFirstBookPage
{
    public class GetFirstBookPageQueryHandler : IRequestHandler<GetFirstBookPageQuery, BookPageResponseDto>
    {
        private readonly IPageRepository _pageRepository;
        private readonly IMapper _mapper;

        public GetFirstBookPageQueryHandler(IPageRepository pageRepository, IMapper mapper)
        {
            _pageRepository = pageRepository;
            _mapper = mapper;
        }

        public async Task<BookPageResponseDto> Handle(GetFirstBookPageQuery request, CancellationToken cancellationToken)
        {
            var firstPage = await _pageRepository.GetFirstPageByBookIdWithContentAsync(request.BookId);

            if (firstPage == null)
            {
                // Kitabın ilk sayfası yoksa null veya hata döndür.
                return null;
            }

            // DTO'ya dönüştür
            return _mapper.Map<BookPageResponseDto>(firstPage);
        }
    }
}
