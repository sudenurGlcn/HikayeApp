using AutoMapper;
using Masal.Application.DTOs;
using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using Masal.Infrastructure.Services.Jwt;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Masal.Application.Exceptions;

namespace Masal.Application.Features.Parents.Queries.LoginParent
{
    public class LoginParentQueryHandler
        : IRequestHandler<LoginParentQuery, AuthResponseDto>
    {
        private readonly IParentRepository _parentRepository;
        private readonly IPasswordHasher<Parent> _passwordHasher;
        private readonly IJwtTokenService _jwtService;
        private readonly IMapper _mapper;

        public LoginParentQueryHandler(
            IParentRepository parentRepository,
            IPasswordHasher<Parent> passwordHasher,
            IJwtTokenService jwtService,
            IMapper mapper)
        {
            _parentRepository = parentRepository;
            _passwordHasher = passwordHasher;
            _jwtService = jwtService;
            _mapper = mapper;
        }

        public async Task<AuthResponseDto> Handle(LoginParentQuery request, CancellationToken cancellationToken)
        {
            var dto = request.LoginDto;

            var parent = await _parentRepository.GetByEmailAsync(dto.Email);
            if (parent is null)
                throw new UnauthorizedException("Bilgilerinizden birisi hatalı, lütfen tekrar deneyin.");

            var result = _passwordHasher.VerifyHashedPassword(parent, parent.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed)
                throw new UnauthorizedException("Bilgilerinizden birisi hatalı, lütfen tekrar deneyin.");

            var token = _jwtService.GenerateToken(parent);

            return new AuthResponseDto
            {
                Token = token,
                User = _mapper.Map<UserDto>(parent)
            };
        }
    }
}
