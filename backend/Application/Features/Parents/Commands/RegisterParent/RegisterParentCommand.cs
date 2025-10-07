using MediatR;
using Masal.Application.DTOs;

namespace Masal.Application.Features.Parents.Commands.RegisterParent
{
    public class RegisterParentCommand : IRequest<AuthResponseDto>
    {
        public RegisterRequestDto RegisterDto { get; set; }

        public RegisterParentCommand(RegisterRequestDto registerDto)
        {
            RegisterDto = registerDto;
        }
    }
}
