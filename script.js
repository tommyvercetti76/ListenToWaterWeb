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

loadFirstVideo();
