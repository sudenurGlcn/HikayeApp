using AutoMapper;
using Masal.Application.Contracts.Persistence;
using Masal.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;

namespace Masal.Application.Features.Books.Queries.GetLatestBooks
{
    public class GetLatestBooksQueryHandler : IRequestHandler<GetLatestBooksQuery, List<BookHomeDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetLatestBooksQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<BookHomeDto>> Handle(GetLatestBooksQuery request, CancellationToken cancellationToken)
        {
            return await _context.Books
                .Include(b => b.BookAuthors)
                    .ThenInclude(ba => ba.Author)
                .OrderByDescending(b => b.CreatedAt)
                .Take(request.Count)
                .ProjectTo<BookHomeDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        }
    }
}
