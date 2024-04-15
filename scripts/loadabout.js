document.addEventListener('DOMContentLoaded', function () {
    console.log('Document loaded. Fetching images...');
    fetch('https://firebasestorage.googleapis.com/v0/b/listentowaterios.appspot.com/o/resources%2Fabout.json?alt=media&token=802b85f8-5457-49d5-a584-2ed1eb9d12ea')
        .then(response => {
            console.log('Received response:', response);
            return response.json();
        })
        .then(data => {
            console.log('JSON data:', data);
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
