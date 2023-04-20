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
  for (let i = 0; i < slides.length; i++) {
    if (i === index) {
      slides[i].classList.add('active');
    } else {
      slides[i].classList.remove('active');
    }
  }
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
