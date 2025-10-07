using MediatR;
using Masal.Application.DTOs;

namespace Masal.Application.Features.Children.Queries.GetParentChildren
{
    public class GetParentChildrenQuery : IRequest<IEnumerable<ChildSummaryDto>>
    {
        public int ParentId { get; }

        public GetParentChildrenQuery(int parentId)
        {
            ParentId = parentId;
        }
    }
}
