// using AutoMapper;
// using Masal.Application.DTOs;
// using Masal.Domain.Interfaces;
// using MediatR;
// using Masal.Domain.Entities;
// using Masal.Application.Contracts.Infrastructure;


// namespace Masal.Application.Features.Books.Queries.GetBookPage
// {
//     public class GetBookPageQueryHandler : IRequestHandler<GetBookPageQuery, GetBookPageResponseDto>
//     {
//         private readonly IBookRepository _bookRepository;
//         private readonly IChildGeneratedWordRepository _childGeneratedWordRepository;
//         private readonly IPythonAgentClient _pythonAgentClient;
//         private readonly IMapper _mapper;
//         private readonly ILogger<GetBookPageQueryHandler> _logger; 
//         private readonly IDailyPageViewRepository _dailyPageViewRepository;
//         private readonly IChildRepository _childRepository;
//         private readonly IReadingProgressRepository _readingProgressRepository;

//         public GetBookPageQueryHandler(
//             IBookRepository bookRepository,
//             IChildGeneratedWordRepository childGeneratedWordRepository,
//             IPythonAgentClient pythonAgentClient,
//             IMapper mapper,
//             ILogger<GetBookPageQueryHandler> logger,
//             IDailyPageViewRepository dailyPageViewRepository,
//             IChildRepository childRepository,
//             IReadingProgressRepository readingProgressRepository) 

//         {
//             _bookRepository = bookRepository;
//             _childGeneratedWordRepository = childGeneratedWordRepository;
//             _pythonAgentClient = pythonAgentClient;
//             _mapper = mapper;
//             _logger = logger;
//             _dailyPageViewRepository = dailyPageViewRepository;
//             _childRepository = childRepository;
//             _readingProgressRepository = readingProgressRepository;
//         }

//         public async Task<GetBookPageResponseDto> Handle(GetBookPageQuery request, CancellationToken cancellationToken)
//         {
//             int targetPageNumber = request.CurrentPageNumber;

//             // Kullanıcı bilgilerini parent ile birlikte çekiyoruz
//             var child = await _childRepository.GetChildWithParentAsync(request.ChildId);
//             if (child == null)
//                 throw new Exception($"Child not found (Id={request.ChildId})");

//             var parent = child.Parent;

//             // Sayfa yönüne göre targetPageNumber belirleme
//             if (request.Direction.Equals("Next", StringComparison.OrdinalIgnoreCase))
//             {
//                 targetPageNumber += 1;
//             }
//             else if (request.Direction.Equals("Previous", StringComparison.OrdinalIgnoreCase))
//             {
//                 targetPageNumber = Math.Max(1, targetPageNumber - 1);
//             }

//             // Sayfayı çek
//             Page? page = await _bookRepository.GetPageByBookIdAndPageNumberAsync(request.BookId, targetPageNumber);
//             if (page == null)
//                 return new GetBookPageResponseDto { PageNumber = targetPageNumber, PageType = "EndOrNotFound" };

//             // Free kullanıcı için Activity sayfasına erişimi engelle
//             if (parent.SubscriptionType == "Free" && page.PageType == "Activity")
//             {
//                 return new GetBookPageResponseDto
//                 {
//                     PageNumber = targetPageNumber,
//                     PageType = "CantAccess",
//                     ContentData = null,
//                     ActivityData = null
//                 };
//             }

//             // Premium veya Content sayfası için mevcut akış
//             GetBookPageResponseDto response = _mapper.Map<GetBookPageResponseDto>(page);

//             // Activity sayfası ise ve childId var ise kelimeleri işle
//             if (response.PageType == "Activity" && response.ActivityData != null)
//             {
//                 await ProcessActivityWordsAsync(page.Activity!, response.ActivityData, child.Id);
//             }

//             // Günlük sayfa görüntüleme sayısını artır (Free kullanıcı için sadece Content sayfası)
//             if (page.PageType != "Activity" || parent.SubscriptionType != "Free")
//             {
//                 bool canRead = await _dailyPageViewRepository.TryIncrementPageViewAsync(child, targetPageNumber);
//                 if (!canRead)
//                 {
//                     response.PageType = "LimitReached";
//                 }
//             }

//             // Okuma ilerlemesini güncelle
//             await _readingProgressRepository.UpdateLastReadPageAsync(child.Id, request.BookId, targetPageNumber);

//             return response;
//         }

//         private async Task ProcessActivityWordsAsync(
//             Activity activity,
//             ActivityPageDto activityData,
//             int childId)
//         {
//             List<ChildGeneratedWord> cachedWords = await _childGeneratedWordRepository.GetGeneratedWordsAsync(
//                 childId,
//                 activity.Id);

//             Dictionary<string, List<string>> dynamicWordsFromCache = cachedWords
//                 .GroupBy(w => w.WordCategory.CategoryName)
//                 .ToDictionary(g => g.Key, g => g.Select(w => w.WordText).ToList());

//             List<string> categoriesToGenerate = new List<string>();
//             List<ActivityWordCategoryDetailDto> finalCategories = new List<ActivityWordCategoryDetailDto>();

//             foreach (var category in activityData.WordCategories)
//             {
//                 if (category.IsDynamic && dynamicWordsFromCache.TryGetValue(category.CategoryName, out var wordsFromCache))
//                 {
//                     category.Words = wordsFromCache;
//                     finalCategories.Add(category);
//                 }
//                 else if (category.IsDynamic)
//                 {
//                     categoriesToGenerate.Add(category.CategoryName);
//                     finalCategories.Add(category);
//                 }
//                 else
//                 {
//                     finalCategories.Add(category);
//                 }
//             }

//             if (categoriesToGenerate.Any())
//             {
//                 _logger.LogInformation("Python Agent'a gönderilecek dinamik kategoriler: {Categories}", string.Join(", ", categoriesToGenerate));

//                 Dictionary<string, List<string>> generatedWords = await _pythonAgentClient.GenerateActivityWordsAsync(
//                     activity.QuestionText,
//                     activity.LogicalValidationRule,
//                     categoriesToGenerate);

//                 _logger.LogInformation("Python Agent'dan alınan ve deserialize edilen sözlükte {WordCount} adet kategori var.", generatedWords.Count);

//                 var wordsToSave = new List<ChildGeneratedWord>();

//                 foreach (var (categoryName, words) in generatedWords)
//                 {
//                     _logger.LogInformation("İşlenen kategori: '{CategoryName}', Kelime sayısı: {WordCount}", categoryName, words.Count);

//                     var targetCategoryDto = finalCategories.FirstOrDefault(c => c.CategoryName == categoryName);
//                     if (targetCategoryDto == null) continue;

//                     targetCategoryDto.Words = words;

//                     var activityWordCategory = activity.ActivityWordCategories
//                         .FirstOrDefault(awc => awc.WordCategory.CategoryName == categoryName);

//                     if (activityWordCategory == null) continue;

//                     var wordCategoryId = activityWordCategory.WordCategoryId;
//                     foreach (var word in words)
//                     {
//                         wordsToSave.Add(new ChildGeneratedWord
//                         {
//                             ChildId = childId,
//                             ActivityId = activity.Id,
//                             WordCategoryId = wordCategoryId,
//                             WordText = word,
//                             IsActive = true
//                         });
//                     }
//                 }

//                 _logger.LogInformation("Veritabanına kaydedilecek toplam yeni kelime sayısı: {SaveCount}", wordsToSave.Count);

//                 if (wordsToSave.Any())
//                 {
//                     await _childGeneratedWordRepository.AddRangeAsync(wordsToSave);
//                     await _childGeneratedWordRepository.SaveChangesAsync();
//                     _logger.LogInformation("{SaveCount} adet kelime veritabanına başarıyla kaydedildi.", wordsToSave.Count);
//                 }
//             }

//             activityData.WordCategories = finalCategories;
//         }
//     }
// }
using AutoMapper;
using Masal.Application.DTOs;
using Masal.Domain.Interfaces;
using MediatR;
using Masal.Domain.Entities;
using Masal.Application.Contracts.Infrastructure;


namespace Masal.Application.Features.Books.Queries.GetBookPage
{
    public class GetBookPageQueryHandler : IRequestHandler<GetBookPageQuery, GetBookPageResponseDto>
    {
        private readonly IBookRepository _bookRepository;
        private readonly IChildGeneratedWordRepository _childGeneratedWordRepository;
        private readonly IPythonAgentClient _pythonAgentClient;
        private readonly IMapper _mapper;
        private readonly ILogger<GetBookPageQueryHandler> _logger; 
        private readonly IDailyPageViewRepository _dailyPageViewRepository;
        private readonly IChildRepository _childRepository;
        private readonly IReadingProgressRepository _readingProgressRepository;

        public GetBookPageQueryHandler(
            IBookRepository bookRepository,
            IChildGeneratedWordRepository childGeneratedWordRepository,
            IPythonAgentClient pythonAgentClient,
            IMapper mapper,
            ILogger<GetBookPageQueryHandler> logger,
            IDailyPageViewRepository dailyPageViewRepository,
            IChildRepository childRepository,
            IReadingProgressRepository readingProgressRepository) 

        {
            _bookRepository = bookRepository;
            _childGeneratedWordRepository = childGeneratedWordRepository;
            _pythonAgentClient = pythonAgentClient;
            _mapper = mapper;
            _logger = logger;
            _dailyPageViewRepository = dailyPageViewRepository;
            _childRepository = childRepository;
            _readingProgressRepository = readingProgressRepository;
        }

        public async Task<GetBookPageResponseDto> Handle(GetBookPageQuery request, CancellationToken cancellationToken)
        {
            int targetPageNumber = request.CurrentPageNumber;

            // Kullanıcı bilgilerini parent ile birlikte çekiyoruz
            var child = await _childRepository.GetChildWithParentAsync(request.ChildId);
            if (child == null)
                throw new Exception($"Child not found (Id={request.ChildId})");

            var parent = child.Parent;

            // Sayfa yönüne göre targetPageNumber belirleme
            if (request.Direction.Equals("Next", StringComparison.OrdinalIgnoreCase))
            {
                targetPageNumber += 1;
            }
            else if (request.Direction.Equals("Previous", StringComparison.OrdinalIgnoreCase))
            {
                targetPageNumber = Math.Max(1, targetPageNumber - 1);
            }

            // Sayfayı çek
            Page? page = await _bookRepository.GetPageByBookIdAndPageNumberAsync(request.BookId, targetPageNumber);
            if (page == null)
                return new GetBookPageResponseDto { PageNumber = targetPageNumber, PageType = "EndOrNotFound" };

            // Free kullanıcı için Activity sayfasına erişimi engelle
            if (parent.SubscriptionType == "Free" && page.PageType == "Activity")
            {
                return new GetBookPageResponseDto
                {
                    PageNumber = targetPageNumber,
                    PageType = "CantAccess",
                    ContentData = null,
                    ActivityData = null
                };
            }

            // Premium veya Content sayfası için mevcut akış
            GetBookPageResponseDto response = _mapper.Map<GetBookPageResponseDto>(page);
            // ✅ Burada kitabın toplam sayfa sayısını al ve response’a ekle
            var book = await _bookRepository.GetByIdAsync(request.BookId);
            if (book != null)
            {
                response.TotalPage = book.TotalPage; // <-- Artık veritabanındaki TotalPage değeri buraya gelir
            }
            // Activity sayfası ise ve childId var ise kelimeleri işle
            if (response.PageType == "Activity" && response.ActivityData != null)
            {
                await ProcessActivityWordsAsync(page.Activity!, response.ActivityData, child.Id);
            }

            // Günlük sayfa görüntüleme sayısını artır (Free kullanıcı için sadece Content sayfası)
            if (page.PageType != "Activity" || parent.SubscriptionType != "Free")
            {
                bool canRead = await _dailyPageViewRepository.TryIncrementPageViewAsync(child, targetPageNumber);
                if (!canRead)
                {
                    response.PageType = "LimitReached";
                }
            }

            // Okuma ilerlemesini güncelle
            await _readingProgressRepository.UpdateLastReadPageAsync(child.Id, request.BookId, targetPageNumber);

            return response;
        }

        private async Task ProcessActivityWordsAsync(
            Activity activity,
            ActivityPageDto activityData,
            int childId)
        {
            List<ChildGeneratedWord> cachedWords = await _childGeneratedWordRepository.GetGeneratedWordsAsync(
                childId,
                activity.Id);

            Dictionary<string, List<string>> dynamicWordsFromCache = cachedWords
                .GroupBy(w => w.WordCategory.CategoryName)
                .ToDictionary(g => g.Key, g => g.Select(w => w.WordText).ToList());

            List<string> categoriesToGenerate = new List<string>();
            List<ActivityWordCategoryDetailDto> finalCategories = new List<ActivityWordCategoryDetailDto>();

            foreach (var category in activityData.WordCategories)
            {
                if (category.IsDynamic && dynamicWordsFromCache.TryGetValue(category.CategoryName, out var wordsFromCache))
                {
                    category.Words = wordsFromCache;
                    finalCategories.Add(category);
                }
                else if (category.IsDynamic)
                {
                    categoriesToGenerate.Add(category.CategoryName);
                    finalCategories.Add(category);
                }
                else
                {
                    finalCategories.Add(category);
                }
            }

            if (categoriesToGenerate.Any())
            {
                _logger.LogInformation("Python Agent'a gönderilecek dinamik kategoriler: {Categories}", string.Join(", ", categoriesToGenerate));

                Dictionary<string, List<string>> generatedWords = await _pythonAgentClient.GenerateActivityWordsAsync(
                    activity.QuestionText,
                    activity.LogicalValidationRule,
                    categoriesToGenerate);

                _logger.LogInformation("Python Agent'dan alınan ve deserialize edilen sözlükte {WordCount} adet kategori var.", generatedWords.Count);

                var wordsToSave = new List<ChildGeneratedWord>();

                foreach (var (categoryName, words) in generatedWords)
                {
                    _logger.LogInformation("İşlenen kategori: '{CategoryName}', Kelime sayısı: {WordCount}", categoryName, words.Count);

                    var targetCategoryDto = finalCategories.FirstOrDefault(c => c.CategoryName == categoryName);
                    if (targetCategoryDto == null) continue;

                    targetCategoryDto.Words = words;

                    var activityWordCategory = activity.ActivityWordCategories
                        .FirstOrDefault(awc => awc.WordCategory.CategoryName == categoryName);

                    if (activityWordCategory == null) continue;

                    var wordCategoryId = activityWordCategory.WordCategoryId;
                    foreach (var word in words)
                    {
                        wordsToSave.Add(new ChildGeneratedWord
                        {
                            ChildId = childId,
                            ActivityId = activity.Id,
                            WordCategoryId = wordCategoryId,
                            WordText = word,
                            IsActive = true
                        });
                    }
                }

                _logger.LogInformation("Veritabanına kaydedilecek toplam yeni kelime sayısı: {SaveCount}", wordsToSave.Count);

                if (wordsToSave.Any())
                {
                    await _childGeneratedWordRepository.AddRangeAsync(wordsToSave);
                    await _childGeneratedWordRepository.SaveChangesAsync();
                    _logger.LogInformation("{SaveCount} adet kelime veritabanına başarıyla kaydedildi.", wordsToSave.Count);
                }
            }

            activityData.WordCategories = finalCategories;
        }
    }
}