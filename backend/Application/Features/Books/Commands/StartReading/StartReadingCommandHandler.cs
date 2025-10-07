using AutoMapper;
using Masal.Application.DTOs;
using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using MediatR;


namespace Masal.Application.Features.Books.Commands.StartReading
{
    public class StartReadingCommandHandler : IRequestHandler<StartReadingCommand, GetBookPageResponseDto>
    {
        private readonly IReadingProgressRepository _readingProgressRepository;
        private readonly IPageRepository _pageRepository;
        private readonly IDailyPageViewRepository _dailyPageViewRepository;
        private readonly IChildRepository _childRepository;
        private readonly IChildGeneratedWordRepository _childGeneratedWordRepository;
        private readonly IMapper _mapper;
        
        public StartReadingCommandHandler(
            IReadingProgressRepository readingProgressRepository,
            IPageRepository pageRepository,
            IDailyPageViewRepository dailyPageViewRepository,
            IChildGeneratedWordRepository childGeneratedWordRepository,
            IChildRepository childRepository,
            IMapper mapper
            )
        {
            _readingProgressRepository = readingProgressRepository;
            _pageRepository = pageRepository;
            _dailyPageViewRepository = dailyPageViewRepository;
            _childRepository = childRepository;
            _childGeneratedWordRepository = childGeneratedWordRepository;
            _mapper = mapper;
            
        }

        public async Task<GetBookPageResponseDto> Handle(StartReadingCommand request, CancellationToken cancellationToken)
        {
            // ✅ Çocuğu parent bilgisiyle birlikte al
            var child = await _childRepository.GetChildWithParentAsync(request.ChildId);
            if (child == null)
                throw new ApplicationException($"Child bulunamadı (Id={request.ChildId})");

            // ✅ Free kullanıcı için günlük sayfa sınırını kontrol et
            if (!child.Parent.SubscriptionType.Equals("Premium", StringComparison.OrdinalIgnoreCase))
            {
                int dailyCount = await _dailyPageViewRepository.GetDailyPageCountAsync(child.Id);
                if (dailyCount >= 500)
                {
                    return new GetBookPageResponseDto
                    {
                        PageType = "LimitReached",
                        PageNumber = 0,
                        
                    };
                }
            }

            // ✅ ReadingProgress kontrolü
            var progress = await _readingProgressRepository.GetByChildAndBookIdAsync(request.ChildId, request.BookId);
            int targetPageNumber;

            if (progress == null)
            {
                // İlk kez okuyorsa yeni kayıt oluştur
                var newProgress = new ReadingProgress
                {
                    ChildId = request.ChildId,
                    BookId = request.BookId,
                    Status = "InProgress",
                    LastReadPageNumber = 1,
                    StartDate = DateTime.UtcNow
                };
                await _readingProgressRepository.AddAsync(newProgress);
                await _readingProgressRepository.SaveChangesAsync();

                targetPageNumber = 1; // İlk sayfa
            }
            else
            {
                // Zaten kayıt varsa kaldığı sayfadan devam
                targetPageNumber = progress.LastReadPageNumber > 0
                    ? progress.LastReadPageNumber
                    : 1;

                progress.Status = "InProgress";
                _readingProgressRepository.Update(progress);
                await _readingProgressRepository.SaveChangesAsync();
            }

            // ✅ Hedef sayfayı getir
            var targetPage = await _pageRepository.GetPageByNumberWithDetailsAsync(request.BookId, targetPageNumber);
            if (targetPage == null)
                throw new ApplicationException($"Sayfa bulunamadı. BookId={request.BookId}, PageNumber={targetPageNumber}");

            // ✅ DTO'ya dönüştür
            var responseDto = _mapper.Map<GetBookPageResponseDto>(targetPage);

            // ✅ Eğer sayfa bir etkinlik sayfasıysa, kelimeleri işle
            if (responseDto.PageType == "Activity" && responseDto.ActivityData != null)
            {
                await ProcessActivityWordsAsync(targetPage.Activity!, responseDto.ActivityData, request.ChildId);
            }

            return responseDto;
        }

        private async Task ProcessActivityWordsAsync(Activity activity, ActivityPageDto activityData, int childId)
        {
            // Önceden oluşturulmuş kelimeleri getir
            var cachedWords = await _childGeneratedWordRepository.GetGeneratedWordsAsync(childId, activity.Id);

            var dynamicWordsFromCache = cachedWords
                .GroupBy(w => w.WordCategory.CategoryName)
                .ToDictionary(g => g.Key, g => g.Select(w => w.WordText).ToList());

            var categoriesToGenerate = new List<string>();
            var finalCategories = new List<ActivityWordCategoryDetailDto>();

            foreach (var category in activityData.WordCategories)
            {
                if (category.IsDynamic && dynamicWordsFromCache.TryGetValue(category.CategoryName, out var words))
                {
                    category.Words = words;
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
        }
    }
}
