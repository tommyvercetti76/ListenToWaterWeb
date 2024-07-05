document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('myModal');
    const modalContent = document.querySelector('.modal-content .gallery');
    const urlParams = new URLSearchParams(window.location.search);
    const cardID = urlParams.get('cardID');
    const baseImageURL = 'https://firebasestorage.googleapis.com/v0/b/listentowaterios.appspot.com/o/images%2Fpaddling_out%2F';

    let globalCardData = [];

    fetch('https://firebasestorage.googleapis.com/v0/b/listentowaterios.appspot.com/o/resources%2Fpaddling_v1%2Fpo_cards_web.json?alt=media&token=1343a0c4-4531-4ce2-9cb2-140af14e603a')
        .then(response => response.json())
        .then(data => {
            globalCardData = data;
            if (cardID) {
                displaySingleCard(cardID);
            } else {
                displayAllCards(data);
            }
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
            displayError('Error loading content. Please try again later.');
        });

    function displayAllCards(data) {
        const container = document.getElementById('cardsContainer');
        container.innerHTML = '';
        data.forEach(card => {
            container.insertAdjacentHTML('beforeend', createCardHTML(card));
        });
    }

    function displaySingleCard(cardID) {
        const container = document.getElementById('cardsContainer');
        container.innerHTML = '';
        const card = globalCardData.find(card => card.id === cardID);
        if (card) {
            container.insertAdjacentHTML('beforeend', createCardHTML(card));
        } else {
            displayError('Card not found. Please check the URL and try again.');
        }
    }

    function createCardHTML(card) {
        const imagePath = `${baseImageURL}${encodeURIComponent(card.lakeName)}%2F${encodeURIComponent(card.lakeName)}1.png?alt=media`;

        return `
            <div class="card" data-id="${card.id}" onclick='fetchAndOpenModal("${card.lakeName}")'>
                <img class="card-image" src="${imagePath}" alt="${card.title}" loading="lazy">
                <div class="card-content">
                    <h2 class="card-title">${card.title}</h2>
                    <p class="card-subtitle">${card.subtitle}</p>
                    <p class="card-description">${card.text}</p>
                </div>
                <div class="card-footer" onclick="event.stopPropagation();">
                    <div class="footer-message"></div>
                    ${card.parkingAvl === 'Y' ? '<span class="icon parking-icon" title="Parking" onclick="showMessage(this, \'Parking Available\')"></span>' : ''}
                    ${card.restroomsAvl === 'Y' ? '<span class="icon toilet-icon" title="Toilets" onclick="showMessage(this, \'Toilet Available\')"></span>' : ''}
                    <span class="icon youtube-icon" title="Video" onclick="openYoutube('${card.youtubeURL}')"></span>
                    <span class="icon location-icon" title="Take me there" onclick="openLocation(${card.location.latitude}, ${card.location.longitude})"></span>
                </div>
            </div>
        `;
    }

    window.fetchAndOpenModal = function(lakeName) {
        const maxImages = 10; // Set a reasonable upper limit for the number of images
        const imagePaths = [];

        for (let i = 1; i <= maxImages; i++) {
            const imagePath = `${baseImageURL}${encodeURIComponent(lakeName)}%2F${encodeURIComponent(lakeName)}${i}.png?alt=media`;
            imagePaths.push(imagePath);
        }

        // Filter out broken or missing images by checking their availability
        const validImagePromises = imagePaths.map(url => {
            return fetch(url)
                .then(response => response.ok ? url : null)
                .catch(() => null);
        });

        Promise.all(validImagePromises)
            .then(urls => urls.filter(url => url !== null))
            .then(validUrls => openModal(lakeName, validUrls));
    }

    window.openModal = function(lakeName, imagePaths) {
        modalContent.innerHTML = ''; // Clear existing content

        const closeButton = document.createElement('span');
        closeButton.classList.add('close');
        closeButton.innerHTML = '&times;';
        closeButton.onclick = closeModal;

        const carousel = document.createElement('div');
        carousel.classList.add('carousel');

        imagePaths.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = lakeName;
            carousel.appendChild(img);
        });

        modalContent.appendChild(closeButton);
        modalContent.appendChild(carousel);

        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('open');
        }, 10);
    }

    window.closeModal = function() {
        modal.classList.remove('open');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Match this duration with the CSS transition duration
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    };

    window.openYoutube = function(url) {
        window.open(url, '_blank');
    }

    window.openLocation = function(lat, lon) {
        const url = `https://www.google.com/maps?q=${lat},${lon}`;
        window.open(url, '_blank');
    }

    window.showMessage = function(element, message) {
        const footer = element.parentElement;
        const messageDiv = footer.querySelector('.footer-message');
        messageDiv.textContent = message;
        messageDiv.style.color = 'green';
        setTimeout(() => {
            messageDiv.textContent = '';
        }, 2000);
    }
});

function displayError(message) {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = `<div class="error">${message}</div>`;
}
