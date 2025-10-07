using Masal.Domain.Interfaces;
using Masal.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using Masal.Domain.Entities;


namespace Masal.Infrastructure.Persistence.Repositories
{
    public class PageRepository : GenericRepository<Page,int>, IPageRepository
    {
        public PageRepository(MasalAppDbContext context) : base(context)
        {
        }

        public async Task<Page?> GetFirstPageByBookIdWithContentAsync(int bookId)
        {
            // PageContent navigation property'sini Include ederek ilk sayfayı çekiyoruz.
            return await _dbSet
                .Include(p => p.PageContent)
                .Where(p => p.BookId == bookId && p.PageNumber == 1)
                .FirstOrDefaultAsync();
        }
        public async Task<Page?> GetPageByNumberWithDetailsAsync(int bookId, int pageNumber)
        {
            // Sayfa içeriği ve aktivite detaylarını çekmek için Include kullanıyoruz.
            // Activity'nin altındaki ActivityWordCategories ve Word'leri de çekiyoruz.
            return await _dbSet
                .Include(p => p.PageContent)
                .Include(p => p.Activity)
                    .ThenInclude(a => a.ActivityWordCategories)
                        .ThenInclude(awc => awc.WordCategory)
                            .ThenInclude(wc => wc.Words)
                .Where(p => p.BookId == bookId && p.PageNumber == pageNumber)
                .FirstOrDefaultAsync();
        }

        public async Task<int> GetTotalPageCountAsync(int bookId)
        {
            // Belirli bir kitaba ait en yüksek sayfa numarasını döndürür.
            return await _dbSet
                .Where(p => p.BookId == bookId)
                .MaxAsync(p => (int?)p.PageNumber) ?? 0;
        }

        // Bu metot, GetPageByNumberWithDetailsAsync içinde birleştirildi. Ancak ayrı bir kullanım için bırakılabilir.
        public async Task<IEnumerable<ActivityWordCategory>> GetActivityWordCategoriesWithWordsAsync(int activityId)
        {
            return await _context.ActivityWordCategories
                .Include(awc => awc.WordCategory)
                    .ThenInclude(wc => wc.Words)
                .Where(awc => awc.ActivityId == activityId)
                .ToListAsync();
        }
    }
}
