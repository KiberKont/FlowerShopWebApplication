namespace FlowerShopWebApplication.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public List<Flower> Flowers { get; set; } = new();
    }
}
