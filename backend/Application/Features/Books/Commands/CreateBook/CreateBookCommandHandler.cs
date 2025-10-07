using AutoMapper;
using Masal.Application.Contracts.Persistence;
using Masal.Domain.Entities;
using MediatR;

namespace Masal.Application.Features.Books.Commands.CreateBook
{
    public class CreateBookCommandHandler : IRequestHandler<CreateBookCommand, int>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CreateBookCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<int> Handle(CreateBookCommand request, CancellationToken cancellationToken)
        {
            var book = _mapper.Map<Book>(request);

            await _context.Books.AddAsync(book, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            // Yazar ilişkilerini ekleyelim
            if (request.AuthorIds != null && request.AuthorIds.Any())
            {
                foreach (var authorId in request.AuthorIds)
                {
                    var bookAuthor = new BookAuthor
                    {
                        BookId = book.Id,
                        AuthorId = authorId
                    };
                    await _context.BookAuthors.AddAsync(bookAuthor, cancellationToken);
                }
                await _context.SaveChangesAsync(cancellationToken);
            }

            return book.Id;
        }
    }
}
