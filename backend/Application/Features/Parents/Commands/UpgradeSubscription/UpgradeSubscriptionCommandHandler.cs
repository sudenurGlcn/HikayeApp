using Masal.Domain.Interfaces;
using MediatR;

namespace Masal.Application.Features.Parents.Commands.UpgradeSubscription
{
    public class UpgradeSubscriptionCommandHandler : IRequestHandler<UpgradeSubscriptionCommand, bool>
    {
        private readonly IParentRepository _parentRepository;

        public UpgradeSubscriptionCommandHandler(IParentRepository parentRepository)
        {
            _parentRepository = parentRepository;
        }

        public async Task<bool> Handle(UpgradeSubscriptionCommand request, CancellationToken cancellationToken)
        {
            var parent = await _parentRepository.GetByIdAsync(request.Request.ParentId);
            if (parent == null)
                return false;

            if (parent.SubscriptionType == "Free")
            {
                parent.SubscriptionType = "Premium";
                parent.SubscriptionEndDate = DateTime.UtcNow.AddYears(1); // 1 yıllık premium örneği

                // Senkron Update çağrısı
                _parentRepository.Update(parent);

                // Değişiklikleri kaydet
                await _parentRepository.SaveChangesAsync();
            }

            return true;
        }
    }
}
