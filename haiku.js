const line1Words = {
    morning: ['Gentle morning dew', 'Sunlit sparkling stream', 'Fresh dawn by the creek'],
    afternoon: ['Rays on the river', 'A glistening cascade', 'Bright noon at the lake'],
    evening: ['Calm twilight ripples', 'Dusk embraces the pond', 'Soft waves on the shore']
};

const line2Words = {
    morning: ['Brings life to the earth', 'Awakens the senses', 'Revives the weary soul'],
    afternoon: ['Quenches the parched ground', 'Eases the burdened mind', 'Soothes the anxious heart'],
    evening: ['Reflects the moonlight', 'Whispers to the night breeze', 'Serenades the stars']
};

const line3Words = {
    morning: ['Nature sings anew', 'Hope dances in the air', 'Life blossoms once more'],
    afternoon: ['Peaceful harmony', 'A moment of respite', 'Stillness in the sun'],
    evening: ['Restful lullaby', 'A quiet symphony', 'Dreams merge with the sky']
};

function getTimeOfDay() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
        return 'morning';
    } else if (currentHour >= 12 && currentHour < 18) {
        return 'afternoon';
    } else {
        return 'evening';
    }
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateHaiku() {
    const timeOfDay = getTimeOfDay();

    const line1 = getRandomElement(line1Words[timeOfDay]);
    const line2 = getRandomElement(line2Words[timeOfDay]);
    const line3 = getRandomElement(line3Words[timeOfDay]);

    return `${line1}\n${line2}\n${line3}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const haikuElement = document.querySelector('.haiku');
    haikuElement.textContent = generateHaiku();
});
