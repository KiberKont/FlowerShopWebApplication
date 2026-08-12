using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FlowerShopWebApplication.Migrations
{
    /// <inheritdoc />
    public partial class AddSeedTestData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Stores",
                columns: new[] { "Id", "StoreAddress" },
                values: new object[,]
                {
                    { 1, "Ул Пушкина, дом калатушкина" },
                    { 2, "ул Красная, дом 255" }
                });

            migrationBuilder.InsertData(
                table: "Inventories",
                columns: new[] { "Id", "FlowerId", "Quantity", "StoreId" },
                values: new object[,]
                {
                    { 1, 1, 10, 1 },
                    { 2, 1, 5, 2 },
                    { 3, 2, 0, 1 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Inventories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Inventories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Inventories",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Stores",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Stores",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
