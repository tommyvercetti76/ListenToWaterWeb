// Fetch the data from Firebase and render cards
let globalCardData = [];
fetch('https://firebasestorage.googleapis.com/v0/b/listentowaterios.appspot.com/o/resources%2Fpaddling_v1%2Fpo_cards.json?alt=media&token=2d27400a-934c-48d4-8f02-e06ba986dde9')
    .then(response => response.json())
    .then(data => {
        globalCardData = data;
        const urlParams = new URLSearchParams(window.location.search);
        const cardId = urlParams.get('cardID');

        if (cardId) {
            const selectedCard = globalCardData.find(card => card.id === cardId);
            if (selectedCard) {
                displaySingleCard(selectedCard);
            } else {
                displayError('Card not found.');
            }
        } else {
            displayAllCards(data);
        }
    })
    .catch(error => {
        console.error("Error fetching data: ", error);
        displayError('Error loading content. Please try again later.');
    });

function displaySingleCard(card) {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = createCardHTML(card);
}

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

// Function to open modal
function openModal(cardId) {
    const selectedCard = globalCardData.find(card => card.id === cardId);
    if (!selectedCard) {
        console.error('Card not found:', cardId);
        return;
    }

    const modal = document.getElementById('myModal');
    const modalContent = document.querySelector('.modal-content');

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

// Function to close modal
function closeModal() {
    const modal = document.getElementById('myModal');
    modal.classList.remove('open');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // Match this duration with the CSS transition duration
}

// Close modal when clicking outside of it
window.onclick = function (event) {
    const modal = document.getElementById('myModal');
    if (event.target == modal) {
        closeModal();
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', closeModal);
});

function displayError(message) {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = `<div class="error">${message}</div>`;
}
