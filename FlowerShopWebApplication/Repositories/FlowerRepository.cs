using FlowerShopWebApplication.Data;
using FlowerShopWebApplication.Models;
using FlowerShopWebApplication.DTOs;
using Microsoft.EntityFrameworkCore;


namespace FlowerShopWebApplication.Repositories
{
    /// <summary>
    /// Реализация репозитория для работы с таблицей цветов через Entity Framework Core.
    /// </summary>
    public class FlowerRepository : IFlowerRepository
    {
        private readonly AppDbContext _context;

        /// <summary>
        /// Конструктор с внедрением зависимости (Dependency Injection).
        /// </summary>
        /// <param name="context">Экземпляр контекста базы данных, созданный DI-контейнером.</param>
        public FlowerRepository(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Получает полный каталог цветов с актуальными адресами наличия для витрины.
        /// </summary>
        /// <returns>Список DTO, оптимизированный для отдачи на фронтенд.</returns>
        public async Task<IEnumerable<FlowerCatalogDto>> GetAllAsync()
        {
            var flowers = await _context.Flowers
                // 1. Жадная загрузка связей  
                .Include(f => f.Inventories) 
                .ThenInclude(i => i.Store)

                // 2. Маппинг сущности БД в плоский DTO для клиента
                .Select(f => new FlowerCatalogDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Price = f.Price,
                    Description = f.Description,
                    ImageUrl = f.ImageUrl,

                    // Собираем адреса только тех точек, где товар физически есть на складе
                    AvailableStores = f.Inventories
                        .Where(i => i.Quantity >0)
                        .Select(i => i.Store!.StoreAddress!) // !(null-forgiving operator (оператор прощения null))
                        .ToList()                            // отключает предеупреждения и проверку на null types
                })                                           // Нужен контроль за отсутсвием null в содержании переменых
                .ToListAsync();

            return flowers;
        }

        public async Task<Flower?> GetByIdAsync(int id)
        {
            // Find - самый эффективный способ поиска по Primary Key в EF Core.
            return await _context.Flowers.FindAsync(id);
        }

        public void Add(Flower flower)
        {
            _context.Flowers.Add(flower);
            // Примечание: Save() нужно вызывать отдельно, чтобы зафиксировать транзакцию.
            // добавлется через механизм ChangeTracker, в оперативнную память.
        }

        public void Delete(Flower flower)
        {
             _context.Flowers.Remove(flower);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }    
    }
}
