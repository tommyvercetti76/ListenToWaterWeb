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
      slide.style.opacity = 0; // Add this line
      setTimeout(() => {
        slide.style.opacity = 1;
      }, 10);
    } else {
      slide.style.opacity = 0; // Add this line
      setTimeout(() => {
        slide.classList.remove('active');
      }, 400);
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

let slideIndex = 0;
let slides = document.getElementsByClassName("slide");

function showSlides() {
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 4000); // Change slides every 4 seconds
}

showSlides();
