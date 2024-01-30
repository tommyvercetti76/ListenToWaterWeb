// poscript.js
// Fetch the data from Firebase and render cards
fetch('https://firebasestorage.googleapis.com/v0/b/listentowaterios.appspot.com/o/resources%2Fpaddling_v1%2Fpo_cards.json?alt=media&token=2d27400a-934c-48d4-8f02-e06ba986dde9')
.then(response => response.json())
.then(data => {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = ''; // Clear existing content
    data.forEach(card => {
        // Create card HTML
        const cardHTML = `
            <div class="card">
                <img class="card-image" src="${card.imageURL}" alt="${card.title}" loading="lazy">
                <div class="card-content">
                    <h2 class="card-title">${card.title}</h2>
                    <p class="card-location">${card.subTitle}</p>
                    <p class="card-description">${card.text}</p>
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
