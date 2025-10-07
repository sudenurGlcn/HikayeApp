using Masal.Application.Contracts.Persistence;

using Masal.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Masal.Infrastructure.Persistence.Context
{
    public class MasalAppDbContext : DbContext, IApplicationDbContext
    {
        public MasalAppDbContext(DbContextOptions<MasalAppDbContext> options) : base(options) { }

        public DbSet<Parent> Parents { get; set; }
        public DbSet<Child> Children { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Page> Pages { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<BookAuthor> BookAuthors { get; set; }
        public DbSet<Author> Authors { get; set; } // DbContext içinde olmalı
        public DbSet<ReadingProgress> ReadingProgress { get; set; } // ✅ Eklendi
        public DbSet<PageContent> PageContents { get; set; }         // ✅ Eklendi

        // Etkinlik ve Yanıt Entity Setleri
        public DbSet<ActivityHint> ActivityHints { get; set; }       // ✅ Eklendi
        public DbSet<ActivityResponse> ActivityResponses { get; set; } // ✅ Eklendi
        public DbSet<ActivityWordCategory> ActivityWordCategories { get; set; } // ✅ Eklendi

        // Kelime ve Kategori Entity Setleri
        public DbSet<WordCategory> WordCategories { get; set; }     // ✅ Eklendi
        public DbSet<Word> Words { get; set; }                     // ✅ Eklendi

        // Çocuk Durum ve İlerleme Entity Setleri
        public DbSet<ChildActivityStatus> ChildActivityStatuses { get; set; } // ✅ Eklendi
        public DbSet<ChildGeneratedWord> ChildGeneratedWords { get; set; } // ✅ Eklendi
        public DbSet<DailyPageView> DailyPageViews { get; set; }   // ✅ Eklendi

        // Ekstra Entity Setleri
        public DbSet<FavoriteBook> FavoriteBooks { get; set; }     // ✅ Eklendi
        public DbSet<GeneratedImage> GeneratedImages { get; set; } // ✅ Eklendi
        public DbSet<BookCategory> BookCategories { get; set; }   // ✅ Eklendi
        // Eğer Category entity'niz yoksa, bu satırı silin.
        public DbSet<Category> Categories { get; set; } 
        
        public DbSet<DidYouKnow> DidYouKnow { get; set; }
        public DbSet<GuideCategory> GuideCategories { get; set; }
        public DbSet<Guide> Guides { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);



            // Örnek: Parent-Child ilişkisi (Mevcut kodunuzdan alındı)
            modelBuilder.Entity<Child>()
                .HasOne<Parent>()
                .WithMany()
                .HasForeignKey(c => c.ParentId)
                .OnDelete(DeleteBehavior.Cascade);

            // Page - PageContent ilişkisi (1-e-0-1: Her sayfanın 0 veya 1 içeriği vardır)
            modelBuilder.Entity<PageContent>()
                .HasOne(pc => pc.Page)
                .WithOne(p => p.PageContent)
                .HasForeignKey<PageContent>(pc => pc.PageId)
                .IsRequired(); // PageContent tablosunda PageId hem PK hem FK olarak kullanılır

            // Page - Activity ilişkisi (1-e-0-1: Her sayfanın 0 veya 1 aktivitesi vardır)
            modelBuilder.Entity<Activity>()
                .HasOne(a => a.Page)
                .WithOne(p => p.Activity)
                .HasForeignKey<Activity>(a => a.PageId)
                .IsRequired();

            // ReadingProgress Unique Index (ChildId, BookId)
            modelBuilder.Entity<ReadingProgress>()
                .HasIndex(rp => new { rp.ChildId, rp.BookId })
                .IsUnique();

            modelBuilder.Entity<Child>()
        .HasOne(c => c.Parent)
        .WithMany(p => p.Children)
        .HasForeignKey(c => c.ParentId)
        .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<GuideCategory>()
            .HasMany(c => c.Guides)
            .WithOne(g => g.Category)
            .HasForeignKey(g => g.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);
            // Index ve unique constraintler migration’dan gelir.
        }

    }

}
