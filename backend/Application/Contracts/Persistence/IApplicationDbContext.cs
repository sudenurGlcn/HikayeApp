using Masal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Masal.Application.Contracts.Persistence
{
    public interface IApplicationDbContext
    {
        DbSet<Parent> Parents { get; set; }
        DbSet<Child> Children { get; set; }
        DbSet<Book> Books { get; set; }
        DbSet<Page> Pages { get; set; }
        DbSet<Activity> Activities { get; set; }
        DbSet<BookAuthor> BookAuthors { get; set; }
        DbSet<Author> Authors { get; set; } // DbContext içinde olmalı
        DbSet<ReadingProgress> ReadingProgress { get; set; } // ✅ Eklendi
        DbSet<PageContent> PageContents { get; set; }         // ✅ Eklendi
        DbSet<ActivityHint> ActivityHints { get; set; }       // ✅ Eklendi
        DbSet<ActivityResponse> ActivityResponses { get; set; } // ✅ Eklendi
        DbSet<ActivityWordCategory> ActivityWordCategories { get; set; } // ✅ Eklendi
        DbSet<WordCategory> WordCategories { get; set; }     // ✅ Eklendi
        DbSet<Word> Words { get; set; }                     // ✅ Eklendi
        DbSet<ChildActivityStatus> ChildActivityStatuses { get; set; } // ✅ Eklendi
        DbSet<ChildGeneratedWord> ChildGeneratedWords { get; set; } // ✅ Eklendi
        DbSet<DailyPageView> DailyPageViews { get; set; }   // ✅ Eklendi
        DbSet<FavoriteBook> FavoriteBooks { get; set; }     // ✅ Eklendi
        DbSet<GeneratedImage> GeneratedImages { get; set; } // ✅ Eklendi
        DbSet<BookCategory> BookCategories { get; set; }   // ✅ Eklendi
        DbSet<Category> Categories { get; set; } 
        DbSet<DidYouKnow> DidYouKnow { get; set; }
        DbSet<Guide> Guides { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
