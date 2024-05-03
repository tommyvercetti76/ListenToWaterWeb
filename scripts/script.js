(function () {
    const playlistId = 'PLxxuC2dcJeMeobJ7W9-kJ9ZzS4T9zz_zn&pp=gAQB';
    const apiKey = 'AIzaSyC4EZV2EEKABIz90yURDjNAcAahQhDoAW0';
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

    async function fetchVideoData(videoId) {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`);
            const data = await response.json();
            if (data.error) {
                console.error('Error fetching video data:', data.error.message);
                return;
            }
            return data.items[0].snippet;
        } catch (error) {
            console.error('Error fetching video data:', error);
        }
    }

    async function loadRandomVideo() {
        await fetchVideoIds();
        if (videoIds.length === 0) {
            console.error('No video IDs found. Please check your playlist ID and API key.');
            return;
        }
        const randomIndex = Math.floor(Math.random() * videoIds.length);
        const videoData = await fetchVideoData(videoIds[randomIndex]);
        if (videoData) {
            playRandomVideo(videoIds[randomIndex], videoData.title, videoData.description);
        }
    }

    function playRandomVideo(videoId, videoTitle, videoDescription) {
        const videoIframe = document.getElementById('video-iframe');
        videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

        const videoTitleElement = document.querySelector('.video-title');
        videoTitleElement.textContent = videoTitle;

        const videoDescriptionElement = document.querySelector('.video-description');
        videoDescriptionElement.textContent = videoDescription;
    }

    document.getElementById('next-btn').addEventListener('click', async () => {
        if (videoIds.length === 0) {
            console.error('No video IDs found. Please check your playlist ID and API key.');
            return;
        }
        const randomIndex = Math.floor(Math.random() * videoIds.length);
        const videoData = await fetchVideoData(videoIds[randomIndex]);
        if (videoData) {
            playRandomVideo(videoIds[randomIndex], videoData.title, videoData.description); // Add videoData.description as the third argument
        }
    });

    document.getElementById("share-btn").addEventListener("click", async () => {
        const currentPageUrl = window.location.href;

        if (navigator.share) {
            // Use Web Share API if available (on supported mobile devices)
            try {
                await navigator.share({
                    title: document.title,
                    url: currentPageUrl,
                });
            } catch (err) {
                console.error("Error sharing the URL:", err);
            }
        } else {
            // Fallback to copying the URL to clipboard
            if (navigator.clipboard) {
                navigator.clipboard.writeText(currentPageUrl)
                    .then(() => alert("Webpage URL copied to clipboard"))
                    .catch(err => console.error("Could not copy text:", err));
            } else {
                // Fallback for older browsers
                const textArea = document.createElement("textarea");
                textArea.value = currentPageUrl;
                textArea.style.position = "fixed"; // Avoid scrolling to bottom
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                alert("Webpage URL copied to clipboard");
            }
        }
    });

    loadRandomVideo();

    window.toggleMenu = function () {
        const menu = document.getElementById('menu-items');
        const menuButton = document.querySelector('.hamburger-menu');
        menu.classList.toggle('active');
        menuButton.classList.toggle('active');
    }        

})();

