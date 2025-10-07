using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using Masal.Infrastructure.Persistence.Context;

namespace Masal.Infrastructure.Persistence.Repositories
{
    public class CategoryRepository : GenericRepository<Category, int>, ICategoryRepository
    {
        public CategoryRepository(MasalAppDbContext context) : base(context)
        {
        }
    }
}
