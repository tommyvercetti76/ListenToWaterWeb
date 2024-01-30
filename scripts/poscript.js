/// poscript.js
// Fetch the data from Firebase and render cards
fetch('https://firebasestorage.googleapis.com/v0/b/listentowaterios.appspot.com/o/resources%2Fpaddling_v1%2Fpo_cards.json?alt=media&token=2d27400a-934c-48d4-8f02-e06ba986dde9')
.then(response => response.json())
.then(data => {
    const container = document.getElementById('cardsContainer');
    // Clear the container before adding new content
    container.innerHTML = '';
    data.forEach(card => {
        container.innerHTML += `
            <div class="card">
                <img class="card-image" src="${card.headerImgURL}" alt="${card.title}">
                <div class="card-content">
                    <h2 class="card-title">${card.title}</h2>
                    <p class="card-subtitle">${card.location}</p>
                    <p class="card-description">${card.description}</p>
                    <a href="${card.youtubeURL}" target="_blank">Watch on YouTube</a>
                    <!-- Add additional info such as galleryImages, etc. -->
                </div>
            </div>
        `;
    });
})
.catch(error => {
    console.error("Error fetching data: ", error);
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '<p>Error loading content. Please try again later.</p>';
});
