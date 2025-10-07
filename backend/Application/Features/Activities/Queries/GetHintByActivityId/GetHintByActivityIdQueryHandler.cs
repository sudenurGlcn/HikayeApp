using Masal.Application.DTOs;
using Masal.Domain.Interfaces;
using MediatR;

namespace Masal.Application.Features.Activities.Queries.GetHintByActivityId
{
    public class GetHintByActivityIdQueryHandler : IRequestHandler<GetHintByActivityIdQuery, ActivityHintDto?>
    {
        private readonly IActivityHintRepository _activityHintRepository;

        public GetHintByActivityIdQueryHandler(IActivityHintRepository activityHintRepository)
        {
            _activityHintRepository = activityHintRepository;
        }

        public async Task<ActivityHintDto?> Handle(GetHintByActivityIdQuery request, CancellationToken cancellationToken)
        {
            var hint = await _activityHintRepository.GetHintByActivityIdAsync(request.ActivityId);

            if (hint == null)
                return null;

            return new ActivityHintDto
            {
                HintText = hint.HintText
            };
        }
    }
}
