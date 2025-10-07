using Masal.Domain.Interfaces;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;

namespace Masal.Infrastructure.Services
{
    public class PasswordHasherService : IPasswordHasherService
    {
        public string HashPassword(string password)
        {
            // Salt oluştur
            byte[] salt = RandomNumberGenerator.GetBytes(16);

            // PBKDF2 ile hashle
            byte[] hash = KeyDerivation.Pbkdf2(
                password,
                salt,
                KeyDerivationPrf.HMACSHA256,
                iterationCount: 100_000,
                numBytesRequested: 32);

            // Salt + Hash’i Base64 string olarak döndür
            return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
        }

        public bool VerifyPassword(string hashedPassword, string providedPassword)
        {
            var parts = hashedPassword.Split('.');
            if (parts.Length != 2) return false;

            var salt = Convert.FromBase64String(parts[0]);
            var storedHash = Convert.FromBase64String(parts[1]);

            var providedHash = KeyDerivation.Pbkdf2(
                providedPassword,
                salt,
                KeyDerivationPrf.HMACSHA256,
                iterationCount: 100_000,
                numBytesRequested: 32);

            return storedHash.SequenceEqual(providedHash);
        }
    }
}
