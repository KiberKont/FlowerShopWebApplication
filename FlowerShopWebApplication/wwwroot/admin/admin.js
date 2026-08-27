// Базовый эндпоинт REST API для управления каталогом цветов
const API_URL = "/api/flowerapi";
// Запасной путь к изображению 
const DEFULT_IMG_PATH = '/img/no-imag.png';
// сылка на <tbody> + кеширование для последующего вызова
const flowerTableBody = document.getElementById("flowerTableBody");
const flowerId = document.getElementById("flowerId");
const addFlowerBtn = document.getElementById("addFlowerBtn");
const flowerForm = document.getElementById("flowerForm");
const flowerModalLabel = document.getElementById("flowerModalLabel");
// Кешировать инпуты формы редактирования
const inputFlowerName = document.getElementById("flowerName");
const inputFlowerCategory = document.getElementById("flowerCategory");
const inputFlowerPrice = document.getElementById("flowerPrice");
const inputFlowerDescription = document.getElementById("flowerDescription");
const inputFlowerImageUrl = document.getElementById("flowerImageUrl");
// Экземпляр модального окна Bootstrap для программного управления (открытие/закрытие)
const flowerModalWindow = new bootstrap.Modal(document.getElementById('flowerModal'));



async function loadFlowers() {
    try {
        const response = await fetch(API_URL);
        // Выбрасование исключений HTTP - статуса ответа сервера       
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        // десериализованый Json в масив JS
        const loadedFlowers = await response.json();
        renderTable(loadedFlowers);
    }
    // Логирование деталей сбоя и выброс ошибки пользователю
    catch (error) {
        console.error("Ошибка загрузки цветов", error);
        alert(`Не удалось загрузить каталог: ${error.message}`);
    }
} 

function renderTable(flowers) {
    // Очистить контейнер для предотвращения дублирования элементов при повторном рендеринге.
    flowerTableBody.innerHTML = '';
    // Подготовить переменную для пакетной сборки разметки (снижает перерисовки DOM).
    let rowsHtml = '';
    
    flowers.forEach(flower => {
        rowsHtml += `
            <tr>
                <td>${flower.id}</td>
                <td>
                    <img src ="${escapeHtml(flower.imageUrl || DEFULT_IMG_PATH)}" alt="${escapeHtml(flower.name)}" class="rounded" style="width: 50px; height: 50px; object-fit: cover;">
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

async function deleteFlower (id) {
    if (!confirm('Вы действительно хотите удалить эту позицию')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) { throw new Error(`Ошибка: ${response.status}`); }
        await loadFlowers()
    }
    catch (error) {
        console.error("Ошибка удаления", error);
        alert(`Не удалось удалить выбранную позицию: ${error.message}`);
    }
}

async function openEditModal(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) { throw new Error(`Ошибка: ${response.status}`); }
        const flower = await response.json();

        flowerId.value = flower.id;
        inputFlowerName.value = flower.name;
        inputFlowerCategory.value = flower.categoryId;
        inputFlowerPrice.value = flower.price;
        inputFlowerDescription.value = flower.description;
        inputFlowerImageUrl.value = flower.imageUrl;
        flowerModalLabel.textContent = 'Редактировать цветок'; 

        flowerModalWindow.show();
    }
    catch (error) {
        console.error("Ошибка редактирования", error);
        alert(`Не удалось открыть для редактирования позицию: ${error.message}`);
    }
}

// настроить делегирование событий для действий в таблице
flowerTableBody.addEventListener('click', async (event) => {
    // Найти первейший элемент с атрибутом data-action
    const actionBtn = event.target.closest('[data-action]');
    if (!actionBtn) return;

    const action = actionBtn.dataset.action;
    const id = actionBtn.dataset.id

    switch (action) {
        case 'delete': await deleteFlower(id)
            break;
        case 'edit': await openEditModal(id)
            break;
    }
});

// Настроить открытие модального окна для создания нового цветка
addFlowerBtn.addEventListener('click', (event) => {
    // Сбросить заголовк окна в режим добавления
    flowerModalLabel.textContent = 'Добавить новый цветок'
    // Очистить форму и скрытый атрибут flowerId
    flowerForm.reset();
    flowerId.value = '';
    flowerModalWindow.show();
});

flowerForm.addEventListener('submit', async (event) => {
    // Отмена перезагрузки страницы
    event.preventDefault();

    const id = flowerId.value;

    // Коректный парсинг в Float требует использования только "."
    // CategoryId не допускает Null, дефолтное занчение "1
    const flowerData = {
        name: inputFlowerName.value.trim(),
        description: inputFlowerDescription.value.trim(),
        price: parseFloat(inputFlowerPrice.value.replace(',', '.')) || 0,
        imageUrl: inputFlowerImageUrl.value.trim(),
        categoryId: parseInt(inputFlowerCategory.value, 10) || 1
    };

    // Определить режим формы создание или редактирвание
    // Режим создания
    if (!id) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(flowerData)
            });
            if (!response.ok) { throw new Error(`Ошибка: ${response.status}`); }
            // Закрыть и очистить окно формы, для последующих использаваний
            flowerModalWindow.hide();
            flowerForm.reset();
            await loadFlowers();
        }
        catch (error) {
            console.error("Ошибка Добавления", error);
            alert(`Не удалось добавить позицию: ${error.message}`);
        }
    }
    // Режим редактирования
    else {
        try {
            // Обязательно добавить ID внутрь объекта так без него контролер 
            // выкинет ошибку 
            flowerData.id = parseInt(id, 10);

            const response = await fetch((`${API_URL}/${id}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(flowerData)
            });
            if (!response.ok) { throw new Error(`Ошибка: ${response.status}`); }
            // Закрыть и очистить окно формы, для последующих использаваний
            flowerModalWindow.hide();
            flowerForm.reset();
            await loadFlowers();
        }
        catch (error) {
            console.error("Ошибка Редактирования", error);
            alert(`Не удалось редактировать позицию: ${error.message}`);
        }
    }
});

// Загрузить список цветов после полной загрузки DOM-дерева
document.addEventListener('DOMContentLoaded', loadFlowers);