document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".carousel");
  const slides = carousel.querySelectorAll(".slide");
  let startX = 0;
  let currentIndex = 0;

  function handleTouchStart(e) {
    startX = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    const endX = e.changedTouches[0].clientX;
    const threshold = carousel.clientWidth / 4;

    if (startX - endX > threshold) {
      nextSlide();
    } else if (endX - startX > threshold) {
      prevSlide();
    }
  }

  function nextSlide() {
    slides[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add("active");
  }

  function prevSlide() {
    slides[currentIndex].classList.remove("active");
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    slides[currentIndex].classList.add("active");
  }

  carousel.addEventListener("touchstart", handleTouchStart);
  carousel.addEventListener("touchend", handleTouchEnd);
});
