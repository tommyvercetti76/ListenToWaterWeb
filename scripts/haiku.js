const timeOfDayPhrases = [
    "morning dewdrops",
    "noon's gentle stream",
    "evening's quiet rain",
    "night's calm river",
    "dawn's misty veil",
    "twilight's soft murmur",
    "sunrise's shimmer",
    "sunset's reflection",
    "daybreak's golden light",
    "dusk's fading glow",
    "midday's warm embrace"
];

const soundPhrases = [
    "whisper to the rocks",
    "ripple through the reeds",
    "splash against the shore",
    "echo in the canyon",
    "tinkle on the leaves",
    "bubble in the creek",
    "gurgle in the brook",
    "patter on the roof",
    "chatter in the breeze",
    "trickle over stones",
    "drum on the earth"
];

const benefitPhrases = [
    "soothe the restless mind",
    "quench the thirst of life",
    "nurture the seeds of hope",
    "purify the soul",
    "calm the weary heart",
    "awaken inner peace",
    "renew the spirit",
    "inspire the dreamer",
    "heal the wounded",
    "uplift the burdened",
    "rekindle the flame"
];

const refreshButton = document.getElementById('refreshButton');
const greedyText = document.getElementById('greedyText');
let clickCounter = 0;

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateHaiku() {
    const timeOfDay = getRandomElement(timeOfDayPhrases);
    const sound = getRandomElement(soundPhrases);
    const benefit = getRandomElement(benefitPhrases);
    return `${timeOfDay}\n${sound}\n${benefit}`;
  }
  
  function updateHaiku() {
    const newHaiku = generateHaiku();
    const haikuElement = document.querySelector('.haiku');
    haikuElement.innerHTML = newHaiku.map(line => `<p class="haiku-line">${line}</p>`).join('');
  }

function getTodayHaiku() {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('haikuDate');
    let haiku;

    if (storedDate === today) {
        haiku = localStorage.getItem('haiku');
    } else {
        haiku = generateHaiku();
        haiku = haiku.charAt(0).toUpperCase() + haiku.slice(1);
        localStorage.setItem('haiku', haiku);
        localStorage.setItem('haikuDate', today);
    }

    return haiku;
}

document.addEventListener('DOMContentLoaded', function () {
    const haiku = getTodayHaiku();
    const haikuElement = document.querySelector('.haiku');
    haikuElement.innerHTML = haiku;

    // Change glow effect based on time of the day
    const currentTime = new Date().getHours();
    let glowColor;

    if (currentTime >= 5 && currentTime < 8) { // Sunrise
        glowColor = '#FFA500';
    } else if (currentTime >= 8 && currentTime < 18) { // Clear noon
        glowColor = '#00BFFF';
    } else if (currentTime >= 18 && currentTime < 20) { // Sunset
        glowColor = '#FF6347';
    } else { // Starry night
        glowColor = '#ADFF2F';
    }

    const haikuElement = document.querySelector('.haiku');
    haikuElement.innerHTML = haiku.map(line => `<p class="haiku-line">${line}</p>`).join('');
    const opacity = 0.4;
    document.body.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
    haikuElement.style.textShadow = `0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 30px ${glowColor}, 0 0 40px ${glowColor}, 0 0 70px ${glowColor}, 0 0 80px ${glowColor}, 0 0 100px ${glowColor}, 0 0 150px ${glowColor}`;
});

refreshButton.addEventListener('click', () => {
    clickCounter++;
    if (clickCounter <= 3) {
        updateHaiku();
    } else {
        refreshButton.style.display = 'none';
        greedyText.removeAttribute('hidden');
        setTimeout(() => {
            greedyText.setAttribute('hidden', true);
            refreshButton.style.display = 'block';
            clickCounter = 0;
        }, 86400000); // 86400000ms = 1 day
    }
});

