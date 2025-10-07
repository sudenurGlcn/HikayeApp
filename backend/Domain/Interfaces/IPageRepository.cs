using Masal.Domain.Entities;
namespace Masal.Domain.Interfaces
{
    public interface IPageRepository : IGenericRepository<Page,int>
    {
        
        Task<Page?> GetFirstPageByBookIdWithContentAsync(int bookId);
        
        Task<Page?> GetPageByNumberWithDetailsAsync(int bookId, int pageNumber);

        
        Task<int> GetTotalPageCountAsync(int bookId);

        
        Task<IEnumerable<ActivityWordCategory>> GetActivityWordCategoriesWithWordsAsync(int activityId);
    }
}
