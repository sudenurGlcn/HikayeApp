using AutoMapper;
using Masal.Application.DTOs;
using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using MediatR;

namespace Masal.Application.Features.FavoriteBooks.Commands.AddFavoriteBook
{
    public class AddFavoriteBookCommandHandler : IRequestHandler<AddFavoriteBookCommand, FavoriteBookResponseDto>
    {
        private readonly IFavoriteBookRepository _favoriteBookRepository;
        private readonly IBookRepository _bookRepository;
        private readonly IChildRepository _childRepository;
        private readonly IMapper _mapper;

        public AddFavoriteBookCommandHandler(
            IFavoriteBookRepository favoriteBookRepository,
            IBookRepository bookRepository,
            IChildRepository childRepository,
            IMapper mapper)
        {
            _favoriteBookRepository = favoriteBookRepository;
            _bookRepository = bookRepository;
            _childRepository = childRepository;
            _mapper = mapper;
        }

        public async Task<FavoriteBookResponseDto> Handle(AddFavoriteBookCommand request, CancellationToken cancellationToken)
        {
            var child = await _childRepository.GetByIdAsync(request.Request.ChildId);
            if (child == null)
                throw new Exception("Geçersiz ChildId.");

            var book = await _bookRepository.GetByIdAsync(request.Request.BookId);
            if (book == null)
                throw new Exception("Geçersiz BookId.");

            // Aynı kitabı iki kez favorilere eklemeyi engelle
            var existing = await _favoriteBookRepository.FindAsync(f =>
                f.ChildID == request.Request.ChildId && f.BookID == request.Request.BookId);

            if (existing.Any())
                throw new Exception("Bu kitap zaten favorilerde mevcut.");

            var favoriteBook = new FavoriteBook
            {
                ChildID = request.Request.ChildId,
                BookID = request.Request.BookId,
                CreatedAt = DateTime.UtcNow
            };

            await _favoriteBookRepository.AddAsync(favoriteBook);
            await _favoriteBookRepository.SaveChangesAsync();

            return new FavoriteBookResponseDto
            {
                Id = favoriteBook.Id,
                ChildId = favoriteBook.ChildID,
                BookId = favoriteBook.BookID,
                BookTitle = book.Title,
                CoverImageURL = book.CoverImageURL,
                CreatedAt = favoriteBook.CreatedAt,
                Message = "Kitap favorilere eklendi."
            };
        }
    }
}
