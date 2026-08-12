namespace FlowerShopWebApplication.DTOs
{
    // формирование отдачи Json для витрины
    public class FlowerCatalogDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public List<string> AvailableStores { get; set; } = []; 
    }
}
