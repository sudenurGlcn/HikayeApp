
using System.Linq.Expressions;

namespace Masal.Domain.Interfaces
{
    public interface IGenericRepository<TEntity, TKey>
        where TEntity : class
    {
        Task<TEntity?> GetByIdAsync(TKey id);
        Task<IEnumerable<TEntity>> GetAllAsync();
        Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate);
        Task AddAsync(TEntity entity);
        void Update(TEntity entity);
        void Remove(TEntity entity);
        Task<int> SaveChangesAsync();
        Task AddRangeAsync(IEnumerable<TEntity> entities);
    }
}
