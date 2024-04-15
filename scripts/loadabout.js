document.addEventListener('DOMContentLoaded', function () {
    fetch('https://firebasestorage.googleapis.com/v0/b/listentowaterios.appspot.com/o/images%2Fdata%2Fimages.json?alt=media')
        .then(response => response.json())
        .then(data => {
            const imageGrid = document.querySelector('.image-grid');
            data.images.forEach(image => {
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                imageItem.innerHTML = `
                    <img src="${image.src}" alt="${image.alt}">
                    <div class="image-caption">
                        ${image.caption}
                        <a href="${image.link}" target="_blank" class="view-link">View</a>
                    </div>
                `;
                imageGrid.appendChild(imageItem);
            });
        })
        .catch(error => console.error('Error loading the images:', error));
});
