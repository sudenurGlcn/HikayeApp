using AutoMapper;
using Masal.Application.DTOs;
using Masal.Domain.Interfaces;
using MediatR;

namespace Masal.Application.Features.Categories.Queries.GetAllCategories
{
    public class GetAllCategoriesQueryHandler : IRequestHandler<GetAllCategoriesQuery, List<CategoryDto>>
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public GetAllCategoriesQueryHandler(ICategoryRepository categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<List<CategoryDto>> Handle(GetAllCategoriesQuery request, CancellationToken cancellationToken)
        {
            var categories = await _categoryRepository.GetAllAsync();

            return _mapper.Map<List<CategoryDto>>(categories);
        }
    }
}
