using AutoMapper;
using Masal.Application.DTOs;
using Masal.Domain.Interfaces;
using MediatR;

namespace Masal.Application.Features.Guides.Queries.GetAllGuides
{
    public class GetAllGuidesQueryHandler : IRequestHandler<GetAllGuidesQuery, List<GuideCategoryDto>>
    {
        private readonly IGuideRepository _guideRepository;

        public GetAllGuidesQueryHandler(IGuideRepository guideRepository)
        {
            _guideRepository = guideRepository;
        }

        public async Task<List<GuideCategoryDto>> Handle(GetAllGuidesQuery request, CancellationToken cancellationToken)
        {
            var categories = await _guideRepository.GetAllGuideCategoriesWithGuidesAsync();

            // Mapping
            var categoryDtos = categories.Select(c => new GuideCategoryDto
            {
                Id = c.Id,
                Title = c.Title,
                Guides = c.Guides.Select(g => new GuideDto
                {
                    Id = g.Id,
                    Title = g.Title,
                    Content = g.Content
                }).ToList()
            }).ToList();

            return categoryDtos;
        }
    }
}
