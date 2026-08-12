namespace FlowerShopWebApplication.Models
{
    public class Store
    {
        public int Id { get; set; }
        public string? StoreAddress { get; set; }
        public ICollection<Inventory> Inventories { get; set; } = [];

    }
}
