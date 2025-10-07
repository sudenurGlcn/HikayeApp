using Masal.Application.DTOs;
using MediatR;

namespace Masal.Application.Features.Parents.Queries.LoginParent
{
    // Login isteği için Query
    public class LoginParentQuery : IRequest<AuthResponseDto>
    {
        public LoginRequestDto LoginDto { get; set; }

        public LoginParentQuery(LoginRequestDto loginDto)
        {
            LoginDto = loginDto;
        }
    }
}
