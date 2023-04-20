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
  
  function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  function generateHaiku() {
    const timeOfDay = getRandomElement(timeOfDayPhrases);
    const sound = getRandomElement(soundPhrases);
    const benefit = getRandomElement(benefitPhrases);
    return `${timeOfDay}\n${sound}\n${benefit}`;
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const haikuElement = document.querySelector(".haiku");
    haikuElement.textContent = generateHaiku();
  });
  