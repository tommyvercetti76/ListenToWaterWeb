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
            <div class="card" onclick="openModal('${card.id}')">
                <img class="card-image" src="${card.imageURL}" alt="${card.title}" loading="lazy">
                <div class="card-content">
                    <h2 class="card-title">${card.title}</h2>
                    <p class="card-subtitle">${card.subtitle}</p>
                    <p class="card-description">${card.text}</p>
                    <a href="${card.youtubeURL}" target="_blank" class="youtube-link">Watch on YouTube</a>
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
});

function displayError(message) {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = `<div class="error">${message}</div>`;
}
