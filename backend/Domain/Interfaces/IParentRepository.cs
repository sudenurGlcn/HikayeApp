using Masal.Domain.Entities;

namespace Masal.Domain.Interfaces
{
    public interface IParentRepository : IGenericRepository<Parent,int>
    {
        // E-posta adresine göre bir ebeveyn kullanıcısını asenkron olarak alır.
        Task<Parent?> GetByEmailAsync(string email);

        Task<Parent?> GetByIdWithChildrenAsync(int id);
        // Yeni bir abonelik başlatma veya mevcut bir aboneliği güncelleme gibi Parent'a özgü operasyonlar buraya eklenebilir.
    }
}
