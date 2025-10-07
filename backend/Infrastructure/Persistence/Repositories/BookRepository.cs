using AutoMapper;
using Masal.Application.DTOs;
using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using Masal.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;

namespace Masal.Infrastructure.Persistence.Repositories
{
    public class BookRepository : GenericRepository<Book,int>, IBookRepository
    {
        private readonly IMapper _mapper;

        public BookRepository(MasalAppDbContext context, IMapper mapper) : base(context)
        {
            _mapper = mapper;
        }

        public async Task<List<BookHomeDto>> GetLatestBooksAsync(int count)
        {
            return await _dbSet
                .Include(b => b.BookAuthors)
                    .ThenInclude(ba => ba.Author)
                .OrderByDescending(b => b.CreatedAt)
                .Take(count)
                .ProjectTo<BookHomeDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<BookDetailDto?> GetBookDetailByIdAsync(int bookId)
        {
            var bookDetail = await _dbSet
        .Include(b => b.BookAuthors)
            .ThenInclude(ba => ba.Author)
        .Where(b => b.Id == bookId)
        .ProjectTo<BookDetailDto>(_mapper.ConfigurationProvider)
        .FirstOrDefaultAsync();

            if (bookDetail != null)
            {
                // Toplam sayfa sayısını çekiyoruz
                bookDetail.TotalPages = await _context.Pages
                    .Where(p => p.BookId == bookId)
                    .CountAsync();
            }

            return bookDetail;
        }

        public async Task<Page?> GetPageByBookIdAndPageNumberAsync(int bookId, int pageNumber)
        {
            // Sayfa tipine göre tüm gerekli verileri tek sorgu ile çekiyoruz (Eager Loading).
            // AutoMapper'ın DTO'ları doğru doldurabilmesi için kritik.
            return await _context.Set<Page>()
                .Where(p => p.BookId == bookId && p.PageNumber == pageNumber)
                // İçerik Sayfası için gerekli
                .Include(p => p.PageContent)
                // Etkinlik Sayfası için gerekli
                .Include(p => p.Activity)
                    .ThenInclude(a => a.ActivityWordCategories)
                        .ThenInclude(awc => awc.WordCategory)
                            .ThenInclude(wc => wc.Words)
                .FirstOrDefaultAsync();
        }

        public async Task<List<BookForCategoryDto>> GetBooksByCategoryIdAsync(int categoryId)
        {
            return await _context.Set<BookCategory>()
                .Where(bc => bc.CategoryId == categoryId)
                .Include(bc => bc.Book)
                    .ThenInclude(b => b.BookAuthors)
                        .ThenInclude(ba => ba.Author)
                .Select(bc => new BookForCategoryDto
                {
                    BookId = bc.Book.Id,
                    Title = bc.Book.Title,
                    CoverImageURL = bc.Book.CoverImageURL,
                    AuthorNames = bc.Book.BookAuthors.Select(ba => ba.Author.AuthorName).ToList()
                })
                .ToListAsync();
        }

        public async Task<List<BookForCategoryDto>> GetFavoriteBooksByChildIdAsync(int childId)
        {
            // FavoriteBook tablosundan, ilişkili Book ve Author bilgilerini eager-load ederek çekiyoruz.
            return await _context.Set<FavoriteBook>()
                .Where(fb => fb.ChildID == childId)
                .Include(fb => fb.Book) // favori ilişkisinin bağlı olduğu Book
                    .ThenInclude(b => b.BookAuthors)
                        .ThenInclude(ba => ba.Author)
                .Select(fb => new BookForCategoryDto
                {
                    BookId = fb.Book.Id,
                    Title = fb.Book.Title,
                    CoverImageURL = fb.Book.CoverImageURL,
                    AuthorNames = fb.Book.BookAuthors
                                    .OrderBy(ba => ba.Id) // istersen sıraya göre
                                    .Select(ba => ba.Author.AuthorName)
                                    .ToList()
                })
                .ToListAsync();
        }

        public async Task<List<BookForCategoryDto>> GetAllBooksWithAuthorsAsync()
        {
            return await _context.Set<Book>()
                .Include(b => b.BookAuthors)
                    .ThenInclude(ba => ba.Author)
                .Select(b => new BookForCategoryDto
                {
                    BookId = b.Id,
                    Title = b.Title,
                    CoverImageURL = b.CoverImageURL,
                    AuthorNames = b.BookAuthors.Select(ba => ba.Author.AuthorName).ToList()
                })
                .ToListAsync();
        }
    }
}
