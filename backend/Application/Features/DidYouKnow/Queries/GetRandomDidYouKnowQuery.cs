using Masal.Application.DTOs;
using MediatR;

namespace Masal.Application.Features.DidYouKnow.Queries
{
    public class GetRandomDidYouKnowQuery : IRequest<DidYouKnowDto>
    {
    }

}
