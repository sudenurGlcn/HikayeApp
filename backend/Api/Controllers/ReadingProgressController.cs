using Masal.Application.Features.ReadingProgresses.Commands.CompleteBook;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Masal.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReadingProgressController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ReadingProgressController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("complete")]
        public async Task<IActionResult> CompleteBook([FromBody] CompleteBookCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result)
                return NotFound("Okuma ilerlemesi bulunamadı.");

            return Ok(new { message = "Kitap başarıyla tamamlandı." });
        }
    }
}
