async function loadFlowers() {

    const response = await fetch('/api/FlowerApi');
    const flowers = await response.json();

    const catalog = document.getElementById('catalog');
    catalog.innerHTML = '';

    flowers.forEach(flower => {
        let storesHtml = '';
        if (flower.availableStores.length > 0) {
            const listItems = flower.availableStores.map(store => `<li>${store}</li>`).join('');
            storesHtml = `
                <div class="stores-list">
                    <p><strong>В наличии:</strong></p>
                    <ul>${listItems}</ul>
                </div>`;
        } else {
            storesHtml = `<p style="color: gray; margin-top: 15px;">Нет в наличии</p>`;
        }

        const card = `
            <div class="flower-card">
                <img src="${flower.imageUrl}" alt="${flower.name}">
                <h3 class="flower-name">${flower.name}</h3>
                <p class="flower-price">${flower.price} ₽</p>
                <p class="flower-desc">${flower.description}</p>
                ${storesHtml}
            </div>
        `;

        catalog.innerHTML += card;
    });
}












loadFlowers();

