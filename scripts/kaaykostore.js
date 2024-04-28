// store.js
document.addEventListener('DOMContentLoaded', function () {
    console.log('Document loaded. Fetching T-shirt data...');
    fetchTShirtData();
    setupFilterHandlers();
});

function fetchTShirtData() {
    fetch('https://firebasestorage.googleapis.com/v0/b/listentowaterios.appspot.com/o/resources%2Fpaddling_v1%2Fmerchitems.json?alt=media&token=c14a8b2d-eeb7-4abc-ab01-2e85fcca3e63')
        .then(response => {
            console.log('Received response:', response);
            return response.json();
        })
        .then(data => {
            console.log('JSON data:', data);
            window.carouselItems = data.carouselItems; // Store data globally
            populateCarousel(window.carouselItems);
        })
        .catch(error => console.error('Error loading T-shirt data:', error));
}

function populateCarousel(items) {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = ''; // Clear existing items
    items.forEach(item => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        carouselItem.innerHTML = `
            <img src="${item.imgSrc[0]}" alt="${item.title}" style="width:100%;">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <p>${formatPrice(item.price)}</p>
        `;
        carouselItem.addEventListener('click', () => openModal(item));
        carousel.appendChild(carouselItem);
    });
}

function setupFilterHandlers() {
    document.getElementById('category-filter').addEventListener('change', filterItems);
    document.getElementById('size-filter').addEventListener('change', filterItems);
    document.getElementById('color-filter').addEventListener('change', filterItems);
}

function filterItems() {
    const category = document.getElementById('category-filter').value;
    const size = document.getElementById('size-filter').value;
    const color = document.getElementById('color-filter').value;

    let filteredItems = window.carouselItems;

    if (category !== "All") {
        filteredItems = filteredItems.filter(item => item.category === category);
    }
    if (size !== "All") {
        filteredItems = filteredItems.filter(item => item.size.includes(size));
    }
    if (color !== "All") {
        filteredItems = filteredItems.filter(item => item.colors.includes(color));
    }

    populateCarousel(filteredItems);
}

function openModal(item) {
    document.getElementById('modal-image').src = item.imgSrc[0];
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-description').textContent = item.description;
    document.getElementById('modal-price').textContent = `Price: ${formatPrice(item.price)}`;
    document.getElementById('modal-sizes').textContent = `Sizes: ${item.size.join(', ')}`;
    document.getElementById('modal-colors').textContent = `Colors: ${item.colors.join(', ')}`;
    document.getElementById('modal').style.display = "block";
}

function closeModal() {
    document.getElementById('modal').style.display = "none";
}

function setupModalCloseHandlers() {
    const modal = document.getElementById('modal');
    modal.onclick = event => {
        if (event.target === modal) {
            closeModal();
        }
    }
    document.getElementsByClassName("close")[0].onclick = closeModal;
}

function formatPrice(price) {
    const numericPrice = Number(price);
    return `$${numericPrice.toFixed(2)}`;
}

setupModalCloseHandlers();
