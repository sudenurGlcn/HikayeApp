using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using MediatR;

namespace Masal.Application.Features.Children.Commands.CreateChild
{
    public class CreateChildCommandHandler : IRequestHandler<CreateChildCommand, int>
    {
        private readonly IChildRepository _childRepository;
        private readonly IParentRepository _parentRepository;

        public CreateChildCommandHandler(IChildRepository childRepository, IParentRepository parentRepository)
        {
            _childRepository = childRepository;
            _parentRepository = parentRepository;
        }

        public async Task<int> Handle(CreateChildCommand request, CancellationToken cancellationToken)
        {
            // Parent'ı getir, Children ile birlikte
            var parent = await _parentRepository.GetByIdWithChildrenAsync(request.ChildDto.ParentId);
            if (parent == null)
                throw new Exception("Parent bulunamadı");

            // Child limit kontrolü
            int maxChildren = parent.SubscriptionType == "Premium" ? 5 : 1;
            if (parent.Children.Count >= maxChildren)
                throw new Exception($"Bu abonelik türü için maksimum {maxChildren} child hesabı oluşturabilirsiniz.");

            // DTO'dan entity'ye dönüştürme
            var child = new Child
            {
                ParentId = request.ChildDto.ParentId,
                ProfileName = request.ChildDto.ProfileName,
                BirthDate = request.ChildDto.BirthDate,
                HasDyslexia = request.ChildDto.HasDyslexia,
                ProfileAvatarURL = request.ChildDto.ProfileAvatarURL
            };

            await _childRepository.AddAsync(child);
            await _childRepository.SaveChangesAsync();

            return child.Id; // frontend için oluşturulan child id'sini dönebiliriz
        }
    }
}
