using Masal.Application.Features.Activities.Queries.GetHintByActivityId;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Masal.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ActivitiesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{activityId}/hint")]
        public async Task<IActionResult> GetActivityHint(int activityId)
        {
            var hintDto = await _mediator.Send(new GetHintByActivityIdQuery(activityId));

            if (hintDto == null)
                return NotFound(new { message = "Hint not found for the given activity." });

            return Ok(hintDto);
        }
    }
}
