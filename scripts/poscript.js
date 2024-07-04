document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('myModal');
    const modalContent = document.querySelector('.modal-content');

    let globalCardData = [];

    fetch('https://firebasestorage.googleapis.com/v0/b/listentowaterios.appspot.com/o/resources%2Fpaddling_v1%2Fpo_cards.json?alt=media&token=2d27400a-934c-48d4-8f02-e06ba986dde9')
        .then(response => response.json())
        .then(data => {
            globalCardData = data;
            displayAllCards(data);
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

    function createCardHTML(card) {
        return `
            <div class="card" data-id="${card.id}">
                <img class="card-image" src="${card.imageURL}" alt="${card.title}" loading="lazy">
                <div class="card-content">
                    <h2 class="card-title">${card.title}</h2>
                    <p class="card-subtitle">${card.subtitle}</p>
                    <p class="card-description">${card.text}</p>
                </div>
                <div class="card-footer">
                    <div class="footer-message"></div>
                    ${card.parkingAvl === 'Y' ? '<span class="icon parking-icon" onclick="showMessage(this, \'Parking Available\')"></span>' : ''}
                    ${card.restroomsAvl === 'Y' ? '<span class="icon toilet-icon" onclick="showMessage(this, \'Toilet Available\')"></span>' : ''}
                    <span class="icon youtube-icon" onclick="openYoutube(\'${card.youtubeURL}\')"></span>
                    <span class="icon location-icon" onclick="openLocation(${card.location.latitude}, ${card.location.longitude})"></span>
                </div>
            </div>
        `;
    }

    window.openModal = function(cardId) {
        const selectedCard = globalCardData.find(card => card.id === cardId);
        if (!selectedCard) {
            console.error('Card not found:', cardId);
            return;
        }

        modalContent.innerHTML = ''; // Clear existing content

        const closeButton = document.createElement('span');
        closeButton.classList.add('close');
        closeButton.innerHTML = '&times;';
        closeButton.onclick = closeModal;

        const carousel = document.createElement('div');
        carousel.classList.add('carousel');

        selectedCard.additionalImageURLs.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = selectedCard.title;
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
