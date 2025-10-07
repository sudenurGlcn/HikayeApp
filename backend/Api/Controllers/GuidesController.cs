using Masal.Application.DTOs;
using Masal.Application.Features.Guides.Queries.GetAllGuides;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Masal.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuidesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GuidesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("categories")]
        public async Task<ActionResult<List<GuideCategoryDto>>> GetAllGuideCategories()
        {
            var result = await _mediator.Send(new GetAllGuidesQuery());
            return Ok(result);
        }
    }
}
