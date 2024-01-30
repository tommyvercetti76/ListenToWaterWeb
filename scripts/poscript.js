// poscript.js
// Fetch the data from Firebase and render cards
let globalCardData = [];
fetch('https://firebasestorage.googleapis.com/v0/b/listentowaterios.appspot.com/o/resources%2Fpaddling_v1%2Fpo_cards.json?alt=media&token=2d27400a-934c-48d4-8f02-e06ba986dde9')
.then(response => response.json())
.then(data => {
    globalCardData = data;
    const container = document.getElementById('cardsContainer');
    container.innerHTML = ''; // Clear existing content
    data.forEach(card => {
        // Create card HTML
        const cardHTML = `
            <div class="card" onclick="openModal('${card.id}')">
                <img class="card-image" src="${card.imageURL}" alt="${card.title}" loading="lazy">
                <div class="card-content">
                    <h2 class="card-title">${card.title}</h2>
                    <p class="card-subtitle">${card.subtitle}</p>
                    <p class="card-text">${card.text}</p>
                    <a href="${card.youtubeURL}" target="_blank" class="youtube-link">Watch on YouTube</a>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML); // Insert new card
    });
})
.catch(error => {
    console.error("Error fetching data: ", error);
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '<p>Error loading content. Please try again later.</p>';
});

// Function to open modal
function openModal(cardId) {
    const selectedCard = globalCardData.find(card => card.id === cardId); // Use global data
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = '';

    // Create image elements for the gallery
    selectedCard.additionalImageURLs.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = selectedCard.title;
        modalContent.appendChild(img);
    });

    modal.style.display = "block"; // Show the modal
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = "none"; // Hide the modal
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    const modal = document.getElementById('myModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
