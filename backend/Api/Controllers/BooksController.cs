using Masal.Application.DTOs;
using Masal.Application.DTOs.Masal.Application.DTOs;
using Masal.Application.Features.Books.Commands.StartReading;
using Masal.Application.Features.Books.Queries.GetBookPage;
using Masal.Application.Features.Books.Queries.GetInProgressBooks;
using Masal.Application.Features.Books.Queries.GetLatestBooks;
using Masal.Application.Features.FavoriteBooks.Commands.AddFavoriteBook;
using Masal.Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Masal.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IBookRepository _bookRepository;

        public BooksController(IMediator mediator, IBookRepository bookRepository)
        {
            _mediator = mediator;
            _bookRepository = bookRepository;
        }

        /// <summary>
        /// Ana sayfada son eklenen kitapları döner (varsayılan 8).
        /// </summary>
        [HttpGet("latest")]
        [ProducesResponseType(typeof(List<BookHomeDto>), 200)]
        public async Task<IActionResult> GetLatestBooks([FromQuery] int count = 8)
        {
            var query = new GetLatestBooksQuery { Count = count };
            var result = await _mediator.Send(query);

            return Ok(result);
        }

        /// <summary>
        /// Kitap detaylarını döner. (Kapak, başlık, yazarlar, etkinlik sayısı, süre, açıklama)
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(BookDetailDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetBookDetail(int id)
        {
            var bookDetail = await _bookRepository.GetBookDetailByIdAsync(id);
            if (bookDetail == null)
                return NotFound();

            return Ok(bookDetail);
        }

        /// <summary>
        /// Belirli bir çocuk için bir kitabı okumaya başlar.
        /// Okuma ilerlemesini 'InProgress' olarak günceller veya yeni bir kayıt oluşturur
        /// ve kitabın ilk sayfa içeriğini döndürür.
        /// </summary>
        /// <param name="request">ChildId ve BookId bilgilerini içerir.</param>
        /// <returns>Kitabın ilk sayfasının içeriği (metin, resim, sayfa numarası).</returns>
        [HttpPost("start-reading")]
        [ProducesResponseType(typeof(GetBookPageResponseDto), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> StartReading([FromBody] StartReadingRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // DTO'dan Command nesnesini oluştur
            var command = new StartReadingCommand(request.ChildId, request.BookId);

            try
            {
                // MediatR ile komutu gönder, CommandHandler hem güncellemeyi yapar hem de ilk sayfayı çeker.
                var firstPageResponse = await _mediator.Send(command);

                if (firstPageResponse == null)
                {
                    // Bu durum, CommandHandler içinde sayfa bulunamazsa fırlatılan ApplicationException'dan farklı bir senaryo olabilir
                    // veya basitçe bir Not Found yanıtı döndürmek için kullanılabilir.
                    return NotFound(new { message = $"Kitap ID: {request.BookId} için başlangıç sayfası bulunamadı." });
                }

                // Başarılı yanıt ve ilk sayfa içeriği
                return Ok(firstPageResponse);
            }
            catch (ApplicationException ex)
            {
                // CommandHandler'dan fırlatılan özel iş mantığı hatalarını yakala (örn: sayfa bulunamadı)
                return NotFound(new { message = ex.Message });
            }
            // Diğer olası hatalar (veritabanı bağlantısı, yetkilendirme vb.) global hata yakalama middleware'ı tarafından ele alınmalıdır.
        }

        /// <summary>
        /// Kitabın ileri veya geri yöndeki sayfa detaylarını getirir.
        /// </summary>
        [HttpPost("page/navigate")] // POST kullanmak, request body ile karmaşık DTO almayı kolaylaştırır.
        public async Task<ActionResult<GetBookPageResponseDto>> NavigatePage([FromBody] GetBookPageQuery query)
        {
            // Query'yi MediatR ile işleyiciye gönder
            var response = await _mediator.Send(query);

            if (response.PageType == "EndOrNotFound")
            {
                // Sayfa bulunamadıysa 404 döndür.
                return NotFound($"Kitapta istenen {response.PageNumber} numaralı sayfa bulunamadı.");
            }

            return Ok(response);
        }

        [HttpGet("by-category/{categoryId}")]
        public async Task<ActionResult<List<BookForCategoryDto>>> GetBooksByCategory(int categoryId)
        {
            var books = await _bookRepository.GetBooksByCategoryIdAsync(categoryId);
            if (books == null || !books.Any())
                return NotFound();

            return Ok(books);
        }

        [HttpGet("children/{childId}/favorites")]
        public async Task<IActionResult> GetChildFavoriteBooks([FromRoute] int childId)
        {
            if (childId <= 0)
                return BadRequest("Invalid childId.");

            var favorites = await _bookRepository.GetFavoriteBooksByChildIdAsync(childId);

            // Eğer child bulunamadıysa/boş listeyse frontend boş liste alır — 200 ile dönüyoruz.
            return Ok(favorites);
        }

        [HttpPost("favorite")]
        public async Task<IActionResult> AddFavorite([FromBody] AddFavoriteBookRequestDto requestDto)
        {
            var command = new AddFavoriteBookCommand(requestDto);
            var response = await _mediator.Send(command);
            return Ok(response);
        }

        [HttpGet("all")]
        [ProducesResponseType(typeof(List<BookForCategoryDto>), 200)]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _bookRepository.GetAllBooksWithAuthorsAsync();
            if (books == null || !books.Any())
                return NotFound();

            return Ok(books);
        }
        [HttpGet("children/{childId}/in-progress")]
        public async Task<IActionResult> GetInProgressBooks([FromRoute] int childId)
        {
            if (childId <= 0)
                return BadRequest("Invalid childId.");

            var query = new GetInProgressBooksQuery(childId);
            var books = await _mediator.Send(query);

            if (books == null || !books.Any())
                return Ok(new List<BookWithProgressDto>()); // Boş liste döner

            return Ok(books);
        }
    }
}