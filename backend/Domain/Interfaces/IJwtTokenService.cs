using Masal.Domain.Entities;

namespace Masal.Domain.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateToken(Parent parent);
    }
}
