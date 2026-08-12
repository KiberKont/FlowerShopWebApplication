using Microsoft.EntityFrameworkCore;
using FlowerShopWebApplication.Models;

namespace FlowerShopWebApplication.Data
{
    public class AppDbContext : DbContext
    {
        // Конструктор
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        // Таблицы (DbSet)
        public DbSet<Flower> Flowers { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Store> Stores { get; set; }
        public DbSet<Inventory> Inventories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) 
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Розы" }
            );

            modelBuilder.Entity<Flower>().HasData(
                new Flower
                { 
                    Id = 1, 
                    Name = "Красная роза",
                    Description = "Классическая красная роза",
                    Price = 5.99m,
                    ImageUrl = "/img/rose_red.jpg",
                    CategoryId = 1
                },
                new Flower
                {
                    Id = 2,
                    Name = "Белая роза",
                    Description = "Нежная белая роза",
                    Price = 6.49m,
                    ImageUrl = "/img/rose_white.jpg",
                    CategoryId = 1
                }
            );

            modelBuilder.Entity<Store>().HasData(
                new Store { Id = 1, StoreAddress = "Ул Пушкина, дом калатушкина"},
                new Store { Id = 2, StoreAddress = "ул Красная, дом 255"}
            );

            modelBuilder.Entity<Inventory>().HasData(
                // Id - первичный ключ самой записи Inventory
                new Inventory { Id = 1, FlowerId = 1, StoreId = 1, Quantity = 10},
                new Inventory { Id = 2, FlowerId = 1, StoreId = 2, Quantity = 5 },
                new Inventory { Id = 3, FlowerId = 2, StoreId = 1, Quantity = 0}
            );
        }
    }
}
