let phrases = {}; // Global variable to hold the phrases data

function getRandomElement(arr) {
    if (!arr || !arr.length) {
        console.error('Empty or undefined array');
        return ""; // Handle the case gracefully
    }
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateHaiku() {
    if (!phrases.timeOfDay || !phrases.element || !phrases.mood) {
        console.error('One or more required haiku categories are undefined.');
        return "Unable to load haiku."; // Provide a default message or handle this scenario appropriately
    }
    const timeOfDayPhrase = getRandomElement(phrases.timeOfDay);
    const soundPhrase = getRandomElement(phrases.element);
    const benefitPhrase = getRandomElement(phrases.mood);
    return `${timeOfDayPhrase}\n${soundPhrase}\n${benefitPhrase}`;
}

function updateHaiku() {
    const haiku = generateHaiku();
    console.log(haiku); // Or update your webpage's content with the haiku
    // Example: document.getElementById('haikuDisplay').textContent = haiku;
}

function loadHaikuData() {
    const storedPhrases = localStorage.getItem('haikuData');
    if (!storedPhrases) {
        fetch('https://firebasestorage.googleapis.com/v0/b/listentowaterios.appspot.com/o/resources%2Fhaiku.json?alt=media&token=9d30e558-1e82-49a5-8237-cf475feb6464')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched data:', data);
                if (data && data.timeOfDay && data.element && data.mood) {
                    localStorage.setItem('haikuData', JSON.stringify(data));
                    phrases = data;
                    updateHaiku();
                } else {
                    throw new Error('Data fetched does not contain expected structure.');
                }
            })
            .catch(error => {
                console.error('Error loading the haiku data:', error);
                phrases = { timeOfDay: [], element: [], mood: [] }; // Set empty defaults
                updateHaiku(); // Attempt to update haiku, likely will use the default empty message
            });
    } else {
        phrases = JSON.parse(storedPhrases);
        updateHaiku();
    }
}

document.addEventListener('DOMContentLoaded', loadHaikuData); // Ensures the data is loaded when the document is ready
