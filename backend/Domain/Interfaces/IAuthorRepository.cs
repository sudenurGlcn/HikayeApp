using Masal.Domain.Entities;

namespace Masal.Domain.Interfaces
{
    public interface IAuthorRepository : IGenericRepository<Author,int>
    {
        // Yazar ismine göre arama yapar.
        Task<IEnumerable<Author>> SearchAuthorsByNameAsync(string name);
    }
}
