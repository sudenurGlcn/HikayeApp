using Masal.Application.Features.DidYouKnow.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Masal.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DidYouKnowController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DidYouKnowController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("random")]
        public async Task<IActionResult> GetRandom()
        {
            var info = await _mediator.Send(new GetRandomDidYouKnowQuery());
            return Ok(info);
        }
    }
}
