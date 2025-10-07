using Masal.Application.DTOs;
using Masal.Application.DTOs.Masal.Application.DTOs;
using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using Masal.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Masal.Infrastructure.Persistence.Repositories
{
    public class ReadingProgressRepository : GenericRepository<ReadingProgress,int>, IReadingProgressRepository
    {
        public ReadingProgressRepository(MasalAppDbContext context) : base(context)
        {
        }

        public async Task<ReadingProgress?> GetByChildAndBookIdAsync(int childId, int bookId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(rp => rp.ChildId == childId && rp.BookId == bookId);
        }

        public async Task<ReadingProgress?> GetByChildAndBookIdWithBookAsync(int childId, int bookId)
        {
            // Kitap bilgisini (örneğin toplam sayfa sayısını hesaplamak için) ekliyoruz
            return await _dbSet
                .Include(rp => rp.Book)
                .FirstOrDefaultAsync(rp => rp.ChildId == childId && rp.BookId == bookId);
        }

        public async Task<bool> CompleteBookAsync(int childId, int bookId)
        {
            var progress = await _dbSet.FirstOrDefaultAsync(rp => rp.ChildId == childId && rp.BookId == bookId);

            if (progress == null)
                return false;

            progress.Status = "Completed";
            progress.CompletionDate = DateTime.UtcNow;

            _dbSet.Update(progress);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<BookForCategoryDto>> GetInProgressBooksByChildIdAsync(int childId)
        {
            return await _dbSet
                .Where(rp => rp.ChildId == childId && rp.Status == "InProgress")
                .Include(rp => rp.Book)
                    .ThenInclude(b => b.BookAuthors)
                        .ThenInclude(ba => ba.Author)
                .Select(rp => new BookForCategoryDto
                {
                    BookId = rp.Book.Id,
                    Title = rp.Book.Title,
                    CoverImageURL = rp.Book.CoverImageURL,
                    AuthorNames = rp.Book.BookAuthors
                                    .OrderBy(ba => ba.Id)
                                    .Select(ba => ba.Author.AuthorName)
                                    .ToList()
                })
                .ToListAsync();
        }

        public async Task UpdateLastReadPageAsync(int childId, int bookId, int currentPage)
        {
            var progress = await _dbSet.FirstOrDefaultAsync(rp => rp.ChildId == childId && rp.BookId == bookId);
            if (progress == null)
                return;

            // Eğer mevcut sayfa, veritabanındaki son okunan sayfadan büyükse güncelle
            if (currentPage > progress.LastReadPageNumber)
            {
                progress.LastReadPageNumber = currentPage;

                // Eğer daha önce başlamamışsa, status'ü güncelle
                if (progress.Status == "NotStarted")
                {
                    progress.Status = "InProgress";
                    progress.StartDate = DateTime.UtcNow;
                }

                _dbSet.Update(progress);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<BookWithProgressDto>> GetInProgressBooksWithProgressByChildIdAsync(int childId)
        {
            return await _dbSet
                .Where(rp => rp.ChildId == childId && rp.Status == "InProgress")
                .Include(rp => rp.Book)
                    .ThenInclude(b => b.BookAuthors)
                        .ThenInclude(ba => ba.Author)
                .Select(rp => new BookWithProgressDto
                {
                    BookId = rp.Book.Id,
                    Title = rp.Book.Title,
                    CoverImageURL = rp.Book.CoverImageURL,
                    AuthorNames = rp.Book.BookAuthors
                                        .OrderBy(ba => ba.Id)
                                        .Select(ba => ba.Author.AuthorName)
                                        .ToList(),

                    // ✅ Progress hesaplama
                    ReadingProgressPercentage = rp.Book.TotalPage > 0
                        ? Math.Round((double)rp.LastReadPageNumber / rp.Book.TotalPage * 100, 2)
                        : 0
                })
                .ToListAsync();
        }
    }
}