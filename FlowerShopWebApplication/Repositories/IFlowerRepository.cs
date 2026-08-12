using FlowerShopWebApplication.Models;
using FlowerShopWebApplication.DTOs;

namespace FlowerShopWebApplication.Repositories
{
    /// <summary>
    /// Контракт для работы с каталогом цветов.
    /// </summary>
    public interface IFlowerRepository
    {
        /// <summary>
        /// Возвращает каталог цветов с актуальными адресами наличия для витрины.
        /// </summary>
        Task<IEnumerable<FlowerCatalogDto>> GetAllAsync();
        /// <summary>
        /// Возвращает товар по ID.
        /// </summary>
        /// <returns>Объект товара или null, если ID не найден.</returns>
        Task<Flower?> GetByIdAsync(int id);

        void Add(Flower flower);
        void Delete(Flower flower);

        /// <summary>
        /// Фиксирует изменения в базе данных.
        /// </summary>
        Task SaveAsync();
    }
}
