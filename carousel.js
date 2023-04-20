let touchStartX = null;
let touchEndX = null;

const slides = document.querySelectorAll('.slide');

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
  slides.forEach((slide, i) => {
    if (i === index) {
      slide.classList.add('active');
      slide.classList.remove('slide-transition');
      slide.style.opacity = 1;
      slide.style.display = 'block';
    } else {
      slide.style.opacity = 0;
      if (slide.classList.contains('active')) {
        slide.classList.add('slide-transition');
      }
      slide.classList.remove('active');
      setTimeout(() => {
        slide.style.display = 'none';
      }, 500);
    }
  });
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

  // Set the first slide as active when the page loads
  if (slides.length > 0) {
    slides[0].classList.add('active');
  }
});

