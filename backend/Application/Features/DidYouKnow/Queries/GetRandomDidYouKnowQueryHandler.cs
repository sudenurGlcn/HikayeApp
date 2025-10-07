using Masal.Application.Contracts.Persistence;
using Masal.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Masal.Application.Features.DidYouKnow.Queries
{
    public class GetRandomDidYouKnowQueryHandler : IRequestHandler<GetRandomDidYouKnowQuery, DidYouKnowDto>
    {
        private readonly IApplicationDbContext _context;

        public GetRandomDidYouKnowQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DidYouKnowDto> Handle(GetRandomDidYouKnowQuery request, CancellationToken cancellationToken)
        {
            var allInfos = await _context.DidYouKnow.ToListAsync(cancellationToken);

            if (!allInfos.Any())
            {
                return new DidYouKnowDto
                {
                    InfoText = "Henüz bir bilgi yok."
                };
            }

            var random = new Random();
            int index = random.Next(allInfos.Count);

            return new DidYouKnowDto
            {
                InfoText = allInfos[index].InfoText
            };
        }
    }
}
