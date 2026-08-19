// Базовый эндпоинт REST API для управления каталогом цветов
const API_URL = "/api/flowerapi";
// Запасной путь к изображению 
const DEFULT_IMG_PATH = '/img/no-imag.png';
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
    // Очиститить контейнер для предотвращения дублирования элементов при повторном рендеринге.
    flowerTableBody.innerHTML = '';
    // Подготовить переменную для пакетной сборки разметки (снижает перерисовки DOM).
    let rowsHtml = '';
    
    flowers.forEach(flower => {
        rowsHtml += `
            <tr>
                <td>${flower.id}</td>
                <td>
                    <img src ="${flower.imageUrl || DEFULT_IMG_PATH}" alt="${escapeHtml(flower.name)} class="rounded" style="width: 50px; high: 50px; object-fit: cover;">
                </td>
                <td>${escapeHtml(flower.name)}</td>
                <td>${flower.categoryId}</td>
                <td>${flower.price} ₽</td>
                <td>${escapeHtml(flower.description || '')}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-1" data-id="${flower.id}" data-action="edit">Редактировать</button>
                    <button class="btn btn-sm btn-outline-danger" data-id="${flower.id}" data-action="delete">Удалить</button>
                </td>
            </tr>
        `;
    });
    // Вставить единый сформированный HTML-блок в DOM за одну операцию.
    flowerTableBody.innerHTML = rowsHtml;  
}

// настроить делегирование событий для действий в таблице
flowerTableBody.addEventListener('click', async (event) => {
    const deleteBtn = event.target.closest('[data-action="delete"]');
    if (!deleteBtn) return;

    const id = deleteBtn.dataset.id;
    if (!confirm('Вы действительно хотите удалить эту позцию')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) { throw new Error(`Ошибка: ${response.status}`); }
        // Обновить таблицу после успешного удаления
        loadFlowers() 
    }
    catch(error) {
        console.error("Ошибка удаления", error);
        alert(`Не удалось удалить выбранную позицию: ${error.message}`);
    }
});