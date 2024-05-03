document.addEventListener('DOMContentLoaded', function () {
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

    function displayHaiku(haiku) {
        const haikuElement = document.querySelector('.haiku');
        const haikuLines = haikuElement.querySelectorAll('.haiku-line');
        haikuLines.forEach((line, index) => {
            line.style.opacity = 0;
            setTimeout(() => {
                line.textContent = haiku.split('\n')[index];
                line.style.opacity = 1;
            }, 500 * (index + 1));
        });
    }

    function updateHaiku() {
        refreshButton.disabled = true;
        const haiku = generateHaiku();
        displayHaiku(haiku);
        localStorage.setItem('haiku', haiku);
        localStorage.setItem('haikuDate', new Date().toDateString());
        setTimeout(() => {
            refreshButton.disabled = false;
        }, 500);
    }

    function loadHaikuData() {
        const storedPhrases = localStorage.getItem('haikuData');
        if (!storedPhrases) {
            fetch('https://firebasestorage.googleapis.com/v0/b/listentowaterios.appspot.com/o/resources%2Fhaiku.json?alt=media&token=9d30e558-1e82-49a5-8237-cf475feb6464')
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched data:', data);
                    localStorage.setItem('haikuData', JSON.stringify(data));
                    phrases = data;
                    updateHaiku(); // Generate and display a new haiku right after data load
                })
                .catch(error => {
                    console.error('Error loading the haiku data:', error);
                });
        } else {
            phrases = JSON.parse(storedPhrases);
            updateHaiku(); // Generate and display haiku from cached phrases
        }
    }

    loadHaikuData();
    refreshButton.addEventListener('click', updateHaiku);
});
