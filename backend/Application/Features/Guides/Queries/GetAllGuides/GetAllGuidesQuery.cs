using Masal.Application.DTOs;
using MediatR;

namespace Masal.Application.Features.Guides.Queries.GetAllGuides
{
    public class GetAllGuidesQuery : IRequest<List<GuideCategoryDto>>
    {
    }
}
