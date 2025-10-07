using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using Masal.Infrastructure.Persistence.Context;

namespace Masal.Infrastructure.Persistence.Repositories
{
    public class FavoriteBookRepository : GenericRepository<FavoriteBook, int>, IFavoriteBookRepository
    {
        public FavoriteBookRepository(MasalAppDbContext context) : base(context)
        {
        }
    }
}
