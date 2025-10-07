using Masal.Application.DTOs;
using Masal.Application.Features.Parents.Commands.RegisterParent;
using Masal.Application.Features.Parents.Queries.LoginParent;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Masal.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Yeni kullanıcı kaydı yapar ve token döner.
        /// </summary>
        /// <param name="request">Register bilgileri</param>
        /// <returns>AuthResponseDto</returns>
        [HttpPost("register")]
        [ProducesResponseType(typeof(AuthResponseDto), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            var command = new RegisterParentCommand(request);
            var result = await _mediator.Send(command);

            // 201 Created ile dön
            return Created(string.Empty, result);
        }

        /// <summary>
        /// Kullanıcı girişi yapar ve token döner.
        /// </summary>
        /// <param name="request">Login bilgileri</param>
        /// <returns>AuthResponseDto</returns>
        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthResponseDto), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var query = new LoginParentQuery(request);
            var result = await _mediator.Send(query);

            return Ok(result);
        }
    }
}
