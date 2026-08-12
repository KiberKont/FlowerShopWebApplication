using Microsoft.EntityFrameworkCore;
using FlowerShopWebApplication.Data;
using Microsoft.Extensions.FileSystemGlobbing.Internal.Patterns;
using FlowerShopWebApplication.Repositories;

var builder = WebApplication.CreateBuilder(args);

// регистрация контекста БД
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefualtConnection")));

//регистрация репозитория
builder.Services.AddScoped<IFlowerRepository, FlowerRepository>();
// API controlers 
builder.Services.AddControllers();
// Приведения всех маршрутов к нижнему регистру для соответствия REST API
builder.Services.AddRouting(options => options.LowercaseUrls = true);

var app = builder.Build();

// Конвейр обработки ошибок для продакшена
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler();
    app.UseHsts();
}

app.UseHttpsRedirection(); // перенаправление с http на htpps
app.UseDefaultFiles(); // Отдача дефолтного файла в папках wwwroot (index.html) 
app.UseStaticFiles(); // Отдача статикик (html, js, css, img)
app.UseRouting(); // Навигация на сайте, составление маршрута без запуска
app.UseAuthorization();
app.MapControllers(); // Маршруты API

app.Run();