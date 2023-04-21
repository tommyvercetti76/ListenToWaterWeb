const timeOfDayPhrases = [
    "Morning dew adorns",
    "Noon's gentle waves",
    "Evening's rain whispers",
    "Night's serene river",
    "Dawn's misty embrace",
    "Twilight's soft lullaby",
    "Sunrise's gleaming dance",
    "Sunset's mirrored hues",
    "Daybreak's golden kiss",
    "Dusk's fading embrace",
    "Midday's warmth cradles",
    "Morning's tender light",
    "Noon's radiant beams",
    "Evening's tranquil drizzle",
    "Night's soothing stream",
    "Dawn's first glimmer",
    "Twilight's hushed serenade",
    "Sunrise's warm awakening",
    "Sunset's glowing farewell",
    "Daybreak's gentle touch",
    "Dusk's comforting blanket",
    "Midmorning's caress",
    "Afternoon's vibrant pulse",
    "Evening's melodic sigh",
    "Night's whispered lull",
    "Dawn's peaceful arrival",
    "Twilight's tender hum",
    "Sunrise's awakening song",
    "Sunset's lingering gaze",
    "Daybreak's blushing embrace",
    "Dusk's calming breath",
    "Midafternoon's embrace",
    "Late night's silent flow"
];

const soundPhrases = [
    "whispers to the stones",
    "ripples through the reeds",
    "splashes on the shore",
    "echoes in the canyon",
    "tinkles o'er the leaves",
    "bubbles in the creek",
    "gurgles in the brook",
    "patters on the roof",
    "chatters in the breeze",
    "trickles o'er the rocks",
    "drums upon the earth",
    "sings to the pebbles",
    "dances with the grass",
    "laps against the sand",
    "reverberates in the cave",
    "glides across the pond",
    "hums along the banks",
    "rushes through the gorge",
    "sweeps over the marsh",
    "murmurs past the logs",
    "splatters on the pavement",
    "ripples 'round the bend",
    "babbles by the meadow",
    "surges down the falls",
    "circles in the whirlpool",
    "tumbles over the cliff",
    "sparkles in the sun",
    "washes o'er the stones",
    "drips from the eaves",
    "sways with the seaweed",
    "skims the water's edge",
    "plays upon the shore",
    "whirls around the bend"
];

const benefitPhrases = [
    "soothes the restless soul",
    "quenches life's deep thirst",
    "nurtures seeds of hope",
    "purifies the spirit",
    "calms the weary heart",
    "awakens inner peace",
    "renews the weary mind",
    "inspires the dreamer",
    "heals the hidden wounds",
    "uplifts the burdened",
    "rekindles love's flame",
    "restores the broken",
    "brings solace to the lost",
    "invigorates the spirit",
    "softens the hardened",
    "strengthens the weak",
    "enlightens the seeker",
    "refreshes the soul",
    "carries away sorrow",
    "embraces the lonely",
    "harmonizes the discord",
    "illuminates the path",
    "mends the fractured",
    "revitalizes the tired",
    "stirs the depths within",
    "transcends the mundane",
    "uncovers hidden truths",
    "elevates the spirit",
    "melts away the barriers",
    "nourishes the heart",
    "quiets the noisy mind",
    "reawakens wonder",
    "transforms the ordinary"
];

const refreshButton = document.getElementById('refreshButton');
const greedyText = document.getElementById('greedyText');
let clickCounter = 3;

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function displayHaiku(haiku) {
    const haikuElement = document.querySelector('.haiku');
    const haikuLines = haikuElement.querySelectorAll('.haiku-line');
  
    haikuLines.forEach((line, index) => {
      // Fade out the line
      line.style.opacity = 0;
  
      // Update the line content and fade it in after it has faded out
      setTimeout(() => {
        line.textContent = haiku.split('\n')[index];
        line.style.opacity = 1;
      }, 500 * (index + 1));
    });
  }
  
  function updateHaiku() {
    const haiku = generateHaiku();
    displayHaiku(haiku);
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
  
    displayHaiku(haiku);
  }  

document.addEventListener('DOMContentLoaded', function () {
    const haiku = getTodayHaiku().split('\n');
    const haikuLines = document.querySelectorAll('.haiku-line');
    haikuLines.forEach((lineElement, index) => {
        lineElement.textContent = haiku[index];
    });

    refreshButton.textContent = clickCounter;
});

refreshButton.addEventListener('mousedown', () => {
    refreshButton.style.boxShadow = 'none';
});

refreshButton.addEventListener('mouseup', () => {
    refreshButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.15)';
});

refreshButton.addEventListener('click', () => {
    if (clickCounter > 0) {
        updateHaiku();
        clickCounter--;
        refreshButton.textContent = clickCounter;
    } else {
        refreshButton.style.display = 'none';
        greedyText.removeAttribute('hidden');
        setTimeout(() => {
            greedyText.setAttribute('hidden', true);
            refreshButton.style.display = 'block';
            clickCounter = 3;
            refreshButton.textContent = clickCounter;
        }, 86400000); // 86400000ms = 1 day
    }
});
