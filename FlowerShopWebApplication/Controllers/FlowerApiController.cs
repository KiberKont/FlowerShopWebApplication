using Microsoft.AspNetCore.Mvc;
using FlowerShopWebApplication.Repositories;
using FlowerShopWebApplication.Models;
using System.Collections;
using Microsoft.AspNetCore.Http.HttpResults;

namespace FlowerShopWebApplication.Controllers
{
    // Контроллер работает как API и автоматически обрабатывает JSON-запросы/ответы
    [ApiController]
    // Базовый маршрут: /api/flowerapi
    [Route("api/flowerapi")]
    public class FlowerApiController : ControllerBase
    {
        // Репозиторий для работы с таблицей цветов 
        private readonly IFlowerRepository _repository;

        // Через конструктор передаётся реализация репозитория (Dependency Injection)
        public FlowerApiController(IFlowerRepository repository)
        {
            _repository = repository;
        }

        // GET /api/flowerapi
        // Возвращает список всех цветов в формате JSON
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var flowers = await _repository.GetAllAsync();
            return Ok(flowers);
        }

        // -- переделать в асинхроность--
        // GET /api/flowerapi/{id}
        // Возвращает один цветок по ID или 404, если не найден
        [HttpGet("{id}")]
        public ActionResult<Flower> GetByIdA(int id)
        {
            var flower = _repository.GetByIdAsync(id);
            if (flower == null)
                return NotFound();

            return Ok(flower);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Flower newFlower)
        {
            if (newFlower == null) { return BadRequest("Данные цветка отстуствуют"); }
            // передаю цветок в репозиторий для сохранения в БД
            _repository.Add(newFlower);
            await _repository.SaveAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Flower updatedFlower)
        {
            // Проверка на null и совпадение ID в URL и теле запроса 
            if (updatedFlower == null || id != updatedFlower.Id)
                return BadRequest("Некоректные данные или несовпадение ID.");
            // получение цветка из БД
            var existingFlower = await _repository.GetByIdAsync(id);
            // проверка на существование цветка в БД
            if (existingFlower == null)
                return NotFound("Цветок с таким ID не найден.");
            // обновление полей объекта
            existingFlower.Name = updatedFlower.Name;
            existingFlower.Price = updatedFlower.Price;
            existingFlower.Description = updatedFlower.Description;
            existingFlower.ImageUrl = updatedFlower.ImageUrl;
            // сохранение изменений в БД, ChangeTracker отслеживает изменения полей.
            await _repository.SaveAsync();
            // статус 204, запрос выполнен успешно.
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // находим в бд цветок
            var deletingFlower = await _repository.GetByIdAsync(id);
            // проверка, на существование цветка
            if (deletingFlower == null)
                return NotFound("Цветок с таким ID не найден.");
            // создание флага удаления, для chengeTracker EF
            _repository.Delete(deletingFlower);
            // применение изменний из СhengeTracker EF
            await _repository.SaveAsync();
            return NoContent();
        }
    }
}
