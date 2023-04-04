// Replace with the actual playlist ID from Wander Sensei's YouTube channel
const playlistId = 'PLxxuC2dcJeMeobJ7W9-kJ9ZzS4T9zz_zn&pp=gAQB';
const apiKey = 'AIzaSyC4EZV2EEKABIz90yURDjNAcAahQhDoAW0'; // Replace with your YouTube Data API key
let currentIndex = 0;
let videoIds = [];

async function fetchVideoIds() {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`);
        const data = await response.json();
        if (data.error) {
            console.error('Error fetching video IDs:', data.error.message);
            return;
        }
        videoIds = data.items.map(item => item.snippet.resourceId.videoId);
    } catch (error) {
        console.error('Error fetching video IDs:', error);
    }
}

async function loadFirstVideo() {
    await fetchVideoIds();
    if (videoIds.length === 0) {
        console.error('No video IDs found. Please check your playlist ID and API key.');
        return;
    }
    playVideo(currentIndex);
}

function playVideo(index) {
    const videoIframe = document.getElementById('video-iframe');
    videoIframe.src = `https://www.youtube.com/embed/${videoIds[index]}?autoplay=1&rel=0`;
}

document.getElementById('next-btn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % videoIds.length;
    playVideo(currentIndex);
});

document.getElementById("share-btn").addEventListener("click", function () {
    const videoIframe = document.getElementById("video-iframe");
    const videoUrl = videoIframe.src;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(videoUrl)
            .then(() => alert("Video URL copied to clipboard"))
            .catch(err => console.error("Could not copy text:", err));
    } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = videoUrl;
        textArea.style.position = "fixed"; // Avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Video URL copied to clipboard");
    }
});
loadFirstVideo();

function toggleMenu() {
    const menuItems = document.getElementById('menu-items');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    menuItems.classList.toggle('open');
    hamburgerMenu.classList.toggle('open');
}

function openModal(modalId, callback) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    if (callback && typeof callback === 'function') {
        callback();
    }
}


function closeModal() {
    const aboutModal = document.getElementById('about-modal');
    aboutModal.style.display = 'none';
}

// To Get Permission and Location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    openModal('get-in-touch-modal', () => initMap(lat, lng));
}


function showError(error) {
    alert("Error: " + error.message);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

function openModal(modalId, callback) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
  
    if (callback && typeof callback === 'function') {
      // Call the callback function without using setTimeout
      callback();
    }
  }
  

// To Display Map
function initMap(lat, lng) {
    const location = { lat: lat, lng: lng };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: location,
        zoom: 14,
    });

    map.addListener('idle', () => {
        map.data.setStyle((feature) => {
            const featureType = feature.getGeometry().getType();
            if (featureType === 'Polygon' && feature.getProperty('kind') === 'water') {
                return {
                    fillColor: '#00f',
                    fillOpacity: 0.5,
                    strokeColor: '#00f',
                    strokeWeight: 1,
                };
            }
        });
    });

    map.data.loadGeoJson(
        'https://storage.googleapis.com/mapsdevsite/json/water.json'
    );
}



