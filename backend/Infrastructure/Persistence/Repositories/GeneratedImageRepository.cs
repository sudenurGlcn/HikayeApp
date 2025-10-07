using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using Masal.Infrastructure.Persistence.Context;

namespace Masal.Infrastructure.Persistence.Repositories
{
    public class GeneratedImageRepository : GenericRepository<GeneratedImage, long>, IGeneratedImageRepository
    {
        public GeneratedImageRepository(MasalAppDbContext context) : base(context)
        {
        }
    }
}
