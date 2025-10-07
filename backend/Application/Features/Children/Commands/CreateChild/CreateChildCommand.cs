using Masal.Application.DTOs;
using MediatR;

namespace Masal.Application.Features.Children.Commands.CreateChild
{
    public class CreateChildCommand : IRequest<int> // dönecek değer: oluşturulan Child Id
    {
        public ChildProfileDto ChildDto { get; set; } = default!;

        public CreateChildCommand(ChildProfileDto childDto)
        {
            ChildDto = childDto;
        }
    }
}
