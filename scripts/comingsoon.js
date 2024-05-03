document.addEventListener('DOMContentLoaded', function () {
    const targetDate = new Date("June 1, 2024 00:00:00").getTime();

    const interval = setInterval(function () {
        const now = new Date().getTime();
        const distance = targetDate - now;

        document.getElementById('days').textContent = Math.floor(distance / (1000 * 60 * 60 * 24));
        document.getElementById('hours').textContent = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById('minutes').textContent = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById('seconds').textContent = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
            clearInterval(interval);
            document.getElementById('countdown').innerHTML = "<h1>We've Launched!</h1>";
        }
    }, 1000);
});
