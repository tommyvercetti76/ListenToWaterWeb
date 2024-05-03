function generateHaiku() {
    if (!phrases.timeOfDay || !phrases.sound || !phrases.benefit) {
        console.error('One or more required haiku categories are undefined.');
        return "Unable to load haiku."; // Provide a default message or handle this scenario appropriately
    }
    const timeOfDayPhrase = getRandomElement(phrases.timeOfDay);
    const soundPhrase = getRandomElement(phrases.sound);
    const benefitPhrase = getRandomElement(phrases.benefit);
    return `${timeOfDayPhrase}\n${soundPhrase}\n${benefitPhrase}`;
}

function loadHaikuData() {
    const storedPhrases = localStorage.getItem('haikuData');
    if (!storedPhrases) {
        fetch('https://firebasestorage.googleapis.com/v0/b/listentowaterios.appspot.com/o/resources%2Fhaiku.json?alt=media&token=9d30e558-1e82-49a5-8237-cf475feb6464')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched data:', data);
                if (data && data.timeOfDay && data.sound && data.benefit) { // Check for expected structure
                    localStorage.setItem('haikuData', JSON.stringify(data));
                    phrases = data;
                    updateHaiku();
                } else {
                    throw new Error('Data fetched does not contain expected structure.');
                }
            })
            .catch(error => {
                console.error('Error loading the haiku data:', error);
                phrases = { timeOfDay: [], sound: [], benefit: [] }; // Set empty defaults
                updateHaiku(); // Attempt to update haiku, likely will use the default empty message
            });
    } else {
        phrases = JSON.parse(storedPhrases);
        updateHaiku();
    }
}
