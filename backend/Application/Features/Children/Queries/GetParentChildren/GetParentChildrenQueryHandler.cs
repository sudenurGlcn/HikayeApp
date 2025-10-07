using Masal.Application.DTOs;
using Masal.Domain.Interfaces;
using MediatR;

namespace Masal.Application.Features.Children.Queries.GetParentChildren
{
    public class GetParentChildrenQueryHandler : IRequestHandler<GetParentChildrenQuery, IEnumerable<ChildSummaryDto>>
    {
        private readonly IParentRepository _parentRepository;

        public GetParentChildrenQueryHandler(IParentRepository parentRepository)
        {
            _parentRepository = parentRepository;
        }

        public async Task<IEnumerable<ChildSummaryDto>> Handle(GetParentChildrenQuery request, CancellationToken cancellationToken)
        {
            var parent = await _parentRepository.GetByIdWithChildrenAsync(request.ParentId);

            if (parent == null)
                throw new Exception("Parent bulunamadı.");

            // Eğer hiç çocuk yoksa boş liste dönelim
            if (parent.Children == null || !parent.Children.Any())
                return new List<ChildSummaryDto>();

            // Free hesap zaten tek çocuk sahibidir.
            // Premium hesapta birden fazla olabilir.
            var childList = parent.Children
                .Select(c => new ChildSummaryDto
                {
                    Id = c.Id,
                    ProfileName = c.ProfileName,
                    ProfileAvatarURL = c.ProfileAvatarURL
                })
                .ToList();

            return childList;
        }
    }
}
