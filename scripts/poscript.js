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
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = '';

    selectedCard.additionalImageURLs.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = selectedCard.title;
        modalContent.appendChild(img);
    });

    modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    const modal = document.getElementById('myModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
