using AutoMapper;
using AutoMapper.QueryableExtensions;
using Masal.Application.Contracts.Persistence;
using Masal.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Masal.Application.Features.Books.Queries.GetBookById
{
    public class GetBookByIdQueryHandler : IRequestHandler<GetBookByIdQuery, BookDetailDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetBookByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<BookDetailDto> Handle(GetBookByIdQuery request, CancellationToken cancellationToken)
        {
            // Kitabı ve ilişkili yazarları çekiyoruz
            var book = await _context.Books
                .Include(b => b.BookAuthors)
                    .ThenInclude(ba => ba.Author)
                .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

            if (book == null)
            {
                // Kitap bulunamadıysa null veya özel bir exception dönebilirsin
                return null!;
            }

            // Entity → DTO dönüşümü
            var dto = _mapper.Map<BookDetailDto>(book);
            return dto;
        }
    }
}
