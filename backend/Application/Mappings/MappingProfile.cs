using AutoMapper;
using Masal.Application.DTOs;
using Masal.Domain.Entities;
using Masal.Domain.Enums;

namespace Masal.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // RegisterRequestDto → Parent
            CreateMap<RegisterRequestDto, Parent>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                // Şifre hash’leme uygulamada service tarafında yapılmalı, burada direkt PasswordHash alanına set ediyoruz
                .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => src.Password))
                .ForMember(dest => dest.SubscriptionType, opt => opt.MapFrom(src => SubscriptionType.Free))
                .ForMember(dest => dest.SubscriptionEndDate, opt => opt.Ignore())
                .ForMember(dest => dest.AdaptyProfileID, opt => opt.Ignore())
                .ForMember(dest => dest.Children, opt => opt.Ignore());

            // LoginRequestDto → Parent (sadece email ve password dolduruluyor)
            CreateMap<LoginRequestDto, Parent>()
                .ForMember(dest => dest.FullName, opt => opt.Ignore())
                .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => src.Password))
                .ForMember(dest => dest.SubscriptionType, opt => opt.Ignore())
                .ForMember(dest => dest.SubscriptionEndDate, opt => opt.Ignore())
                .ForMember(dest => dest.AdaptyProfileID, opt => opt.Ignore())
                .ForMember(dest => dest.Children, opt => opt.Ignore());

            // Parent → UserDto
            CreateMap<Parent, UserDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.SubscriptionType, opt => opt.MapFrom(src => src.SubscriptionType.ToString()))
                .ForMember(dest => dest.SubscriptionEndDate, opt => opt.MapFrom(src => src.SubscriptionEndDate));

            // Parent → AuthResponseDto (UserDto içini otomatik mapler)
            CreateMap<Parent, AuthResponseDto>()
                .ForMember(dest => dest.Token, opt => opt.Ignore()) // Token service tarafından doldurulacak
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src));

            // 📚 Book → BookHomeDto
            CreateMap<Book, BookHomeDto>()
    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
    .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
    .ForMember(dest => dest.CoverImageURL, opt => opt.MapFrom(src => src.CoverImageURL))
    .ForMember(dest => dest.Authors, opt => opt.MapFrom(src =>
        src.BookAuthors.Select(ba => ba.Author.AuthorName).ToList()));

            // 📚 Book → BookDetailDto
            CreateMap<Book, BookDetailDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.CoverImageURL, opt => opt.MapFrom(src => src.CoverImageURL))
                .ForMember(dest => dest.EstimatedReadingTimeMinutes, opt => opt.MapFrom(src => src.EstimatedReadingTimeMinutes))
                .ForMember(dest => dest.ActivityCount, opt => opt.MapFrom(src => src.ActivityCount))
                .ForMember(dest => dest.Authors, opt => opt.MapFrom(src =>
                    src.BookAuthors.Select(ba => ba.Author.AuthorName).ToList()));

            

            // ✅ StartReadingRequestDto → ReadingProgress
            // Çocuğun bir kitabı okumaya başlamasını temsil eder.
            // ReadingProgress entity’sinde başlangıç durumu "NotStarted" veya "InProgress" olarak ayarlanabilir.
            CreateMap<StartReadingRequestDto, ReadingProgress>()
                .ForMember(dest => dest.ChildId, opt => opt.MapFrom(src => src.ChildId))
                .ForMember(dest => dest.BookId, opt => opt.MapFrom(src => src.BookId))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "InProgress")) // varsayılan durum
                .ForMember(dest => dest.LastReadPageNumber, opt => opt.MapFrom(src => 1)) // ilk sayfa
                .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.CompletionDate, opt => opt.Ignore()) // tamamlanma serviste set edilir
                .ForMember(dest => dest.Child, opt => opt.Ignore()) // Navigation serviste set edilir
                .ForMember(dest => dest.Book, opt => opt.Ignore()); // Navigation serviste set edilir


// ✅ Page → BookPageResponseDto
// Kitabın bir sayfasını frontend’e göndermek için kullanılır.
CreateMap<Page, BookPageResponseDto>()
    .ForMember(dest => dest.PageNumber, opt => opt.MapFrom(src => src.PageNumber))
    .ForMember(dest => dest.PageType, opt => opt.MapFrom(src => src.PageType))
    .ForMember(dest => dest.TextContent, opt => opt.MapFrom(src => 
        src.PageContent != null ? src.PageContent.TextContent : null))
    .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.BaseImageURL));


            // 1. Page -> GetBookPageResponseDto
            // Ana DTO. Page'den ortak bilgileri alır ve alt DTO'ları (ContentData veya ActivityData) doldurur.
            CreateMap<Page, GetBookPageResponseDto>()
                .ForMember(dest => dest.PageNumber, opt => opt.MapFrom(src => src.PageNumber))
                .ForMember(dest => dest.PageType, opt => opt.MapFrom(src => src.PageType))
                // PageType "Content" ise PageContentDto'yu mapler.
                .ForMember(dest => dest.ContentData, opt => opt.MapFrom(src =>
                    src.PageType == "Content" && src.PageContent != null
                        ? src // Kendisini PageContentDto'ya maplemek için kullanacak
                        : null))
                // PageType "Activity" ise ActivityPageDto'yu mapler.
                .ForMember(dest => dest.ActivityData, opt => opt.MapFrom(src =>
                    src.PageType == "Activity" && src.Activity != null
                        ? src.Activity // Activity entity'sini ActivityPageDto'ya maplemek için kullanacak
                        : null));

            // 2. Page -> PageContentDto
            // "Content" tipindeki sayfanın verilerini doldurur.
            CreateMap<Page, PageContentDto>()
                .ForMember(dest => dest.ImageURL, opt => opt.MapFrom(src => src.BaseImageURL))
                .ForMember(dest => dest.TextContent, opt => opt.MapFrom(src =>
                    src.PageContent!.TextContent)); // PageContent'in null olmayacağı varsayılır.

            // 3. Activity -> ActivityPageDto
            // "Activity" tipindeki sayfanın verilerini doldurur. Activity entity'sinden başlar.
            // Activity -> ActivityPageDto
            CreateMap<Activity, ActivityPageDto>()
                .ForMember(dest => dest.ActivityId, opt => opt.MapFrom(src => src.Id)) // 🆕 BURASI
                .ForMember(dest => dest.QuestionText, opt => opt.MapFrom(src => src.QuestionText))
                .ForMember(dest => dest.WordCategories, opt => opt.MapFrom(src =>
                    src.ActivityWordCategories.Select(awc => new ActivityWordCategoryDetailDto
                    {
                        CategoryName = awc.WordCategory.CategoryName,
                        IsDynamic = awc.WordCategory.IsDynamic,
                        Words = awc.WordCategory.Words.Select(w => w.WordText).ToList()
                    }).ToList()
                ));

            // 4. ActivityWordCategory -> ActivityWordCategoryDetailDto
            // Etkinliğe ait kelime kategorisi ve kelimeleri doldurur.
            // ActivityWordCategory -> ActivityWordCategoryDetailDto Mapping Güncellemesi
            CreateMap<ActivityWordCategory, ActivityWordCategoryDetailDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.WordCategory.CategoryName))
                .ForMember(dest => dest.IsDynamic, opt => opt.MapFrom(src => src.WordCategory.IsDynamic)) // YENİ EKLENDİ
                .ForMember(dest => dest.Words, opt => opt.MapFrom(src => src.WordCategory.Words.Select(w => w.WordText).ToList()));
            CreateMap<Category, CategoryDto>();
            CreateMap<Guide, GuideDto>();
        }
    }
}
