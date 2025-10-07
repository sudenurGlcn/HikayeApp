
using Masal.Application.Mappings;
using Masal.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Masal.Infrastructure.Services.Jwt;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using Masal.Infrastructure.Persistence.Repositories;
using Masal.Application.Contracts.Persistence;
using Masal.Application.Features.DidYouKnow.Queries;
using Masal.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSettings);

// Authentication ekle
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var key = Encoding.UTF8.GetBytes(jwtSettings["Secret"]);
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],

        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],

        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),

        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});
builder.Services.AddScoped<IPasswordHasher<Parent>, PasswordHasher<Parent>>();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));
builder.Services.AddAuthorization();

// Add services to the container.
builder.Services.AddControllers();

// Correct way to add AutoMapper to the service collection
// This line finds all profiles in the assembly where MappingProfile is located.
builder.Services.AddAutoMapper(cfg => { }, typeof(MappingProfile).Assembly);


builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS (Development için geniþ politika)
builder.Services.AddCors(options =>
{
    options.AddPolicy("Default", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin();
        // Ýstersen aþaðýdaki gibi belirli origin'leri tanýmlayabilirsin:
        // .WithOrigins("http://localhost:5079", "https://localhost:7124", "http://localhost:19006");
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // Geliþtirmede HTTPS yönlendirmesini kapat (mobil cihazlarda self-signed sertifika sorun çýkarabilir)
}
else
{
    app.UseHttpsRedirection();
}

// Geliþtirme ortamýnda veritabanýný otomatik oluþtur (SQL Server eriþilebilirse)
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<Masal.Infrastructure.Persistence.Context.MasalAppDbContext>();
        await db.Database.EnsureCreatedAsync();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[DB INIT] Veritabaný oluþturulamadý: {ex.Message}");
    }
}
app.UseCors("Default");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();