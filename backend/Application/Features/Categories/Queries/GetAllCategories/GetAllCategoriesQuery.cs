using Masal.Application.DTOs;
using MediatR;

namespace Masal.Application.Features.Categories.Queries.GetAllCategories
{
    public class GetAllCategoriesQuery : IRequest<List<CategoryDto>>
    {
    }
}
