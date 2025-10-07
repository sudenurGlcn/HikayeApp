using Masal.Application.DTOs;
using MediatR;

namespace Masal.Application.Features.Parents.Commands.UpgradeSubscription
{
    public class UpgradeSubscriptionCommand : IRequest<bool>
    {
        public UpgradeSubscriptionRequestDto Request { get; set; }

        public UpgradeSubscriptionCommand(UpgradeSubscriptionRequestDto request)
        {
            Request = request;
        }
    }
}
