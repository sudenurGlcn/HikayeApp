using AutoMapper;
using Masal.Application.DTOs;
using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Masal.Infrastructure.Services.Jwt;
using Masal.Application.Exceptions;

namespace Masal.Application.Features.Parents.Commands.RegisterParent
{
    public class RegisterParentCommandHandler
        : IRequestHandler<RegisterParentCommand, AuthResponseDto>
    {
        private readonly IParentRepository _parentRepository;
        private readonly IPasswordHasher<Parent> _passwordHasher;
        private readonly IJwtTokenService _jwtService;
        private readonly IMapper _mapper;

        public RegisterParentCommandHandler(
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

        public async Task<AuthResponseDto> Handle(RegisterParentCommand request, CancellationToken cancellationToken)
        {
            var dto = request.RegisterDto;

            // Email kontrolü
            var existing = await _parentRepository.GetByEmailAsync(dto.Email);
            if (existing is not null)
                throw new BadRequestException("Email already exists.");

            // Yeni kullanıcı oluştur
            var parent = new Parent(dto.Name, dto.Email, string.Empty);
            parent.PasswordHash = _passwordHasher.HashPassword(parent, dto.Password);

            await _parentRepository.AddAsync(parent);
            await _parentRepository.SaveChangesAsync();

            // Token oluştur
            var token = _jwtService.GenerateToken(parent);

            return new AuthResponseDto
            {
                Token = token,
                User = _mapper.Map<UserDto>(parent)
            };
        }
    }
}
