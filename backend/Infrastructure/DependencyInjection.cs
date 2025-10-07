using Masal.Application.Contracts.Infrastructure;
using Masal.Application.Contracts.Persistence;
using Masal.Domain.Interfaces;
using Masal.Infrastructure.Persistence.Context;
using Masal.Infrastructure.Persistence.Repositories;
using Masal.Infrastructure.Services;
using Masal.Infrastructure.Services.Jwt;
using Masal.Infrastructure.Services.PythonAgentService;
using Microsoft.EntityFrameworkCore;

namespace Masal.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // JWT ayarlarını configuration’dan bind et
            services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));

            services.AddDbContext<MasalAppDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("MasalDb")));

            services.AddScoped<IApplicationDbContext>(provider =>
                provider.GetRequiredService<MasalAppDbContext>());

            // Servisleri IoC Container’a ekle
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped<IPasswordHasherService, PasswordHasherService>();
            services.AddScoped<IParentRepository, ParentRepository>();
            services.AddScoped<IBookRepository, BookRepository>();
            services.AddScoped<IPageRepository, PageRepository>();
            services.AddScoped<IReadingProgressRepository, ReadingProgressRepository>();
            services.AddScoped<IChildGeneratedWordRepository, ChildGeneratedWordRepository>();
            services.AddScoped<IActivityResponseRepository, ActivityResponseRepository>();
            services.AddScoped<IGeneratedImageRepository, GeneratedImageRepository>();
            services.AddScoped<IActivityRepository, ActivityRepository>();
            services.AddScoped<IDailyPageViewRepository, DailyPageViewRepository>();
            services.AddScoped<IChildRepository, ChildRepository>();
            services.AddScoped<IFavoriteBookRepository, FavoriteBookRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IActivityHintRepository, ActivityHintRepository>();
            services.AddScoped<IGuideRepository, GuideRepository>();
            // 1. Python Agent Ayarlarını Kaydet
            services.Configure<PythonAgentSettings>(configuration.GetSection("PythonAgentSettings"));

            // 2. HttpClientFactory kullanarak PythonAgentClient'ı kaydet
            // Bu, HttpClient'ın yaşam döngüsünü IHttpClientFactory'ye bırakır.
            services.AddHttpClient<IPythonAgentClient, PythonAgentHttpClient>(); // BaseUrl ayarlanacak içerde
            services.AddScoped<AgentOrchestrationService>();

            // Eğer BaseAddress'i sadece PythonAgentHttpClient içinde ayarladıysanız, 
            // yukarıdaki lambda ifadesi içi boş kalabilir:
            // services.AddHttpClient<IPythonAgentClient, PythonAgentHttpClient>();

            return services;
        }
    }
}
