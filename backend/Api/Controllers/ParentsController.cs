using Masal.Application.DTOs;
using Masal.Application.Features.Parents.Commands.UpgradeSubscription;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Masal.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParentsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ParentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("upgrade-subscription")]
        public async Task<IActionResult> UpgradeSubscription([FromBody] UpgradeSubscriptionRequestDto request)
        {
            var command = new UpgradeSubscriptionCommand(request);
            var result = await _mediator.Send(command);

            if (!result)
                return NotFound(new { message = "Parent not found or already Premium." });

            return Ok(new { message = "Subscription upgraded to Premium." });
        }
    }
}
