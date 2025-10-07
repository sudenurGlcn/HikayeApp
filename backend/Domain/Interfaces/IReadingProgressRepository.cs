using Masal.Application.DTOs;
using Masal.Application.DTOs.Masal.Application.DTOs;
using Masal.Domain.Entities;

namespace Masal.Domain.Interfaces
{
    public interface IReadingProgressRepository : IGenericRepository<ReadingProgress,int>
    {
        /// <summary>
        /// Belirli bir çocuk ve kitap için mevcut okuma ilerlemesini asenkron olarak alır.
        /// </summary>
        /// <param name="childId">Çocuk ID'si.</param>
        /// <param name="bookId">Kitap ID'si.</param>
        /// <returns>Okuma ilerlemesi kaydı (varsa) veya null.</returns>
        Task<ReadingProgress?> GetByChildAndBookIdAsync(int childId, int bookId);

        // ✅ Yeni Metot: Kitap İlerlemesini Kitabın kendisiyle birlikte alır.
        Task<ReadingProgress?> GetByChildAndBookIdWithBookAsync(int childId, int bookId);

        Task<bool> CompleteBookAsync(int childId, int bookId);

        Task<List<BookForCategoryDto>> GetInProgressBooksByChildIdAsync(int childId);
        Task UpdateLastReadPageAsync(int childId, int bookId, int currentPage);
        Task<List<BookWithProgressDto>> GetInProgressBooksWithProgressByChildIdAsync(int childId);
    }
}