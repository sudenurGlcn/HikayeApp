using Masal.Domain.Entities;

namespace Masal.Domain.Interfaces
{
    public interface IDailyPageViewRepository : IGenericRepository<DailyPageView,long>
    {
        /// <summary>
        /// Çocuğun belirtilen tarihteki toplam okuduğu sayfa sayısını döndürür.
        /// </summary>
        Task<int> GetDailyPageCountAsync(int childId);

        /// <summary>
        /// Günlük sayfa hakkını kontrol eder ve bir sayfa ekler.
        /// </summary>
        /// <returns>True: sayfa okunabilir, False: limit doldu.</returns>
        Task<bool> TryIncrementPageViewAsync(Child child, int pageId);
    }
}
