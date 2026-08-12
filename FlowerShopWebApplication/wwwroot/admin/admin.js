// Define the API URL for fetching flower data
const API_URL = "/api/flowerapi";
// сылка на <tbody> + кеширование для последующего вызова
const flowerTableBody = document.getElementById("flowerTableBody");
const flowerForm = document.getElementById("flowerForm");



async function loadFlowers() {
    try {
        const response = await fetch(API_URL);
        // Выбрасование исключений HTTP - статуса ответа сервера       
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        // десериализованый Json в масив JS
        const loadedFlowers = await response.json();
    }
    // Логирование деталей сбоя и выброс ошибки пользователю
    catch (error) {
        console.error("Ошибка загрузки цветов", error);
        alert(`Не удалось загрузить каталог: ${error.message}`);
    }
} 

function renderTable(flowers) {
    // Очистить контейнер таблицы.
    // Предотвращает дублирование старых записей при обновлении данных.
    flowerTableBody.innerHTML = '';
    // Подготовить строковую переменную для пакетной сборки HTML.
    // Снижает количество перерисовок DOM, ускоряя рендеринг.
    let rowsHtml = '';
    // Выполняется перебор массива flowers...
    // Сформировать строку <tr> с ячейками данных.
    flowers.forEach(flower => {
        rowsHtml += `
            <tr>
                <td>${flower.id}</td>
                <td>
                    <img src ="${imgPath}" alt="${escapeHtml(flower.name)} class="rounded" style="weight: 50px; high: 50px; object-fit: cover;">
                </td>
                <td>${escapeHtml(flower.name)}</td>
                <td>${flower.CategoryI}</td>
                <td>${flower.Price} ₽</td>
                <td>${escapeHtml(flower.Description || '')}</td>
                <td class="text-end">
                    // доделать кнопки с использованием data-action="delete"
                </td>
            </tr>
        `;
    });
    // Добавить кнопки действий с data-id и data-action.
    // Позволяет использовать паттерн делегирования событий.

    // Добавить HTML-строку текущего цветка к общей переменной.

    // Вставить итоговый собранный HTML в tbody.
}