using Masal.Application.DTOs;
using MediatR;

namespace Masal.Application.Features.Activities.Queries.GetHintByActivityId
{
    public class GetHintByActivityIdQuery : IRequest<ActivityHintDto?>
    {
        public int ActivityId { get; set; }

        public GetHintByActivityIdQuery(int activityId)
        {
            ActivityId = activityId;
        }
    }
}
