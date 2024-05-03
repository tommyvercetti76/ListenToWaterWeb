const refreshButton = document.getElementById('refreshButton');
let phrases = {};

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateHaiku() {
    const timeOfDayPhrase = getRandomElement(phrases.timeOfDay);
    const soundPhrase = getRandomElement(phrases.sound);
    const benefitPhrase = getRandomElement(phrases.benefit);
    return `${timeOfDayPhrase}\n${soundPhrase}\n${benefitPhrase}`;
}

function updateHaiku() {
    const haiku = generateHaiku();
    const haikuElement = document.querySelector('.haiku');
    const haikuLines = haikuElement.querySelectorAll('.haiku-line');
    refreshButton.setAttribute('disabled', true);

    haikuLines.forEach((line, index) => {
        line.style.opacity = 0;
        setTimeout(() => {
            line.textContent = haiku.split('\n')[index];
            line.style.opacity = 1;
            if (index === haikuLines.length - 1) {
                setTimeout(() => {
                    refreshButton.removeAttribute('disabled');
                }, 500);
            }
        }, 500 * (index + 1));
    });
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
    fetch('https://firebasestorage.googleapis.com/v0/b/listentowaterios.appspot.com/o/resources%2Fhaiku.json?alt=media&token=9d30e558-1e82-49a5-8237-cf475feb6464')
        .then(response => response.json())
        .then(data => {
            phrases = data; // assuming the JSON structure matches what is needed for haiku generation
            const haiku = getTodayHaiku().split('\n');
            const haikuLines = document.querySelectorAll('.haiku-line');
            haikuLines.forEach((lineElement, index) => {
                lineElement.style.opacity = 0;
                lineElement.textContent = haiku[index];
                setTimeout(() => {
                    lineElement.style.opacity = 1;
                }, 500 * (index + 1));
            });
        })
        .catch(error => {
            console.error('Error loading the haiku data:', error);
        });
    
    refreshButton.addEventListener('click', updateHaiku);
});
