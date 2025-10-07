using Masal.Application.DTOs;
using Masal.Domain.Entities;

namespace Masal.Domain.Interfaces
{
    public interface IBookRepository : IGenericRepository<Book,int>
    {
        Task<List<BookHomeDto>> GetLatestBooksAsync(int count);

        // Kitap detaylarını ID ile çekmek için
        Task<BookDetailDto?> GetBookDetailByIdAsync(int bookId);

        Task<Page?> GetPageByBookIdAndPageNumberAsync(int bookId, int pageNumber);

        Task<List<BookForCategoryDto>> GetBooksByCategoryIdAsync(int categoryId);

        Task<List<BookForCategoryDto>> GetFavoriteBooksByChildIdAsync(int childId);

        Task<List<BookForCategoryDto>> GetAllBooksWithAuthorsAsync();
    }
}
