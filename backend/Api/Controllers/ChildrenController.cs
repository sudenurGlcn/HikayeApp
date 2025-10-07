using Masal.Application.DTOs;
using Masal.Application.Features.Children.Commands.CreateChild;
using Masal.Application.Features.Children.Queries.GetParentChildren;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Masal.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChildrenController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ChildrenController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> CreateChild([FromBody] ChildProfileDto dto)
        {
            try
            {
                var command = new CreateChildCommand(dto);
                var childId = await _mediator.Send(command);
                return Ok(new { ChildId = childId });
            }
            catch (Exception ex)
            {
                // Eğer limit aşıldıysa 400 BadRequest dön
                if (ex.Message.Contains("maksimum"))
                    return BadRequest(new { Error = ex.Message });

                // Diğer hatalar için 500 Internal Server Error
                return StatusCode(500, new { Error = "hata" });
            }
        }

        [HttpGet("parent/{parentId}")]
        public async Task<IActionResult> GetChildrenByParentId(int parentId)
        {
            try
            {
                var query = new GetParentChildrenQuery(parentId);
                var children = await _mediator.Send(query);

                return Ok(children);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
    }
}
