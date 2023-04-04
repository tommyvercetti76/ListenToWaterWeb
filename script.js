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

document.getElementById("share-btn").addEventListener("click", function() {
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

  const video = document.getElementById('video-iframe');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  let dominantColor = '#ffffff';

  video.addEventListener('play', () => {
    updateColor();
  });

  function updateColor() {
    if (!video.paused && !video.ended) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      dominantColor = getDominantColor(imageData);
      document.body.style.backgroundColor = dominantColor;
      setTimeout(updateColor, 1000); // Update color every second
    }
  }

  function getDominantColor(imageData) {
    const blockSize = 5;
    const colorCounts = {};
    let dominantColor = null;
    let maxCount = 0;

    for (let y = 0; y < imageData.height; y += blockSize) {
      for (let x = 0; x < imageData.width; x += blockSize) {
        const index = (y * imageData.width + x) * 4;
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        const color = `rgb(${r},${g},${b})`;

        colorCounts[color] = (colorCounts[color] || 0) + 1;

        if (colorCounts[color] > maxCount) {
          maxCount = colorCounts[color];
          dominantColor = color;
        }
      }
    }

    return dominantColor;
  }


