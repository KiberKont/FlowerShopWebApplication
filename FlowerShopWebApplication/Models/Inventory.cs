namespace FlowerShopWebApplication.Models
{
    public class Inventory
    {
        public int Id { get; set; }
        public int FlowerId { get; set; }
        public Flower? Flower { get; set; }
        public int StoreId { get; set; }
        public Store? Store { get; set; }
        public int Quantity { get; set; }
    }
}
