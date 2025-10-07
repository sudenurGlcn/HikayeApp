using Masal.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Masal.Application.DTOs;

namespace Masal.Api.Controllers
{
    [ApiController]
    [Route("api/activity-responses")]
    public class ActivityResponsesController : ControllerBase
    {
        private readonly AgentOrchestrationService _orchestration;

        public ActivityResponsesController(AgentOrchestrationService orchestration)
        {
            _orchestration = orchestration;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ActivityResponseRequestDto request)

        {
            var (isCorrect, feedback, imageUrl) = await _orchestration.ProcessActivityResponseAsync(
                request.ChildId, request.ActivityId, request.ResponseText);

            return Ok(new
            {
                isCorrect,
                feedback,
                generatedImageUrl = imageUrl
            });
        }
    }

    
}
