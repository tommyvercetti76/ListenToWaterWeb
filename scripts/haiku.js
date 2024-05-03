document.addEventListener('DOMContentLoaded', function () {
    const refreshButton = document.getElementById('refreshButton');

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateHaiku(phrases) {
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

    function updateHaiku(phrases) {
        const haiku = generateHaiku(phrases);
        displayHaiku(haiku);
        localStorage.setItem('haiku', haiku);
        localStorage.setItem('haikuDate', new Date().toDateString());
    }

    function loadHaikuData() {
        let phrases = localStorage.getItem('haikuData');
        if (!phrases) {
            fetch('https://firebasestorage.googleapis.com/v0/b/listentowaterios.appspot.com/o/resources%2Fhaiku.json?alt=media&token=9d30e558-1e82-49a5-8237-cf475feb6464')
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('haikuData', JSON.stringify(data));
                    const haiku = loadTodayHaiku(data);
                    displayHaiku(haiku);
                })
                .catch(error => {
                    console.error('Error loading the haiku data:', error);
                    phrases = { timeOfDay: [], sound: [], benefit: [] }; // Minimal empty structure
                    updateHaiku(phrases); // Generate haiku with possible empty content or fallback content
                });
        } else {
            phrases = JSON.parse(phrases);
            const haiku = loadTodayHaiku(phrases);
            displayHaiku(haiku);
        }
    }

    function loadTodayHaiku(phrases) {
        const storedDate = localStorage.getItem('haikuDate');
        const today = new Date().toDateString();
        if (storedDate === today) {
            return localStorage.getItem('haiku');
        }
        return generateHaiku(phrases);
    }

    loadHaikuData();

    refreshButton.addEventListener('click', () => {
        updateHaiku(phrases);
    });
});
