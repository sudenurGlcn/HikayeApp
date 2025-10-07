using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using Masal.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Masal.Infrastructure.Persistence.Repositories
{
    public class DailyPageViewRepository : GenericRepository<DailyPageView, long>, IDailyPageViewRepository
    {
        public DailyPageViewRepository(MasalAppDbContext context) : base(context)
        {
        }

        public async Task<int> GetDailyPageCountAsync(int childId)
        {
            DateTime today = DateTime.UtcNow.Date;
            return await _context.DailyPageViews
                .Where(v => v.ChildId == childId && v.ViewDate == today)
                .CountAsync();
        }

        public async Task<bool> TryIncrementPageViewAsync(Child child, int pageId)
        {
            // Premium kullanıcı sınırsız
            if (child.Parent.SubscriptionType.Equals("Premium", StringComparison.OrdinalIgnoreCase))
            {
                // Zaten okunmuşsa tekrar eklemez, ama sayfa erişimi serbest
                var exists = await _context.DailyPageViews
                    .AnyAsync(v => v.ChildId == child.Id && v.PageId == pageId && v.ViewDate == DateTime.UtcNow.Date);
                if (!exists)
                {
                    _context.DailyPageViews.Add(new DailyPageView
                    {
                        ChildId = child.Id,
                        PageId = pageId,
                        ViewDate = DateTime.UtcNow.Date
                    });
                    await _context.SaveChangesAsync();
                }
                return true;
            }

            // Free kullanıcı
            int dailyCount = await GetDailyPageCountAsync(child.Id);

            if (dailyCount >= 500)
                return false; // Günlük limit doldu

            // Sayfa daha önce okunmuş mu kontrol et
            bool alreadyRead = await _context.DailyPageViews
                .AnyAsync(v => v.ChildId == child.Id && v.PageId == pageId && v.ViewDate == DateTime.UtcNow.Date);

            if (alreadyRead)
                return true; // Sayfa zaten okunmuş, limit sayılmıyor

            // Yeni sayfa ekle
            _context.DailyPageViews.Add(new DailyPageView
            {
                ChildId = child.Id,
                PageId = pageId,
                ViewDate = DateTime.UtcNow.Date
            });

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
