let touchStartX = null;
let touchEndX = null;
let slideIndex = 0;
let slides = document.getElementsByClassName("slide");

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].clientX;
  if (touchStartX && touchEndX) {
    if (touchEndX - touchStartX > 100) {
      previousSlide();
    } else if (touchStartX - touchEndX > 100) {
      nextSlide();
    }
  }
}

function setActiveSlide(index) {
  const activeSlide = document.querySelector('.slide.active');
  if (activeSlide) {
    activeSlide.style.opacity = 0;
    setTimeout(() => {
      activeSlide.classList.remove('active');
    }, 1000); // Match the transition duration in the CSS
  }

  slides[index].style.opacity = 1;
  slides[index].classList.add('active');
}

function nextSlide() {
  const activeSlide = document.querySelector('.slide.active');
  const activeIndex = Array.from(slides).indexOf(activeSlide);
  const nextIndex = (activeIndex + 1) % slides.length;
  setActiveSlide(nextIndex);
}

function previousSlide() {
  const activeSlide = document.querySelector('.slide.active');
  const activeIndex = Array.from(slides).indexOf(activeSlide);
  const prevIndex = (activeIndex - 1 + slides.length) % slides.length;
  setActiveSlide(prevIndex);
}

document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel');
  carousel.addEventListener('touchstart', handleTouchStart, false);
  carousel.addEventListener('touchend', handleTouchEnd, false);

  if (slides.length > 0) {
    setActiveSlide(0);
    showSlides();
  }
});

function showSlides() {
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  setActiveSlide(slideIndex - 1);
  setTimeout(showSlides, 4000);
}
