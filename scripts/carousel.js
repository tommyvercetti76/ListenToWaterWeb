let slideIndex = 0;
let slides = document.getElementsByClassName("slide");

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

document.addEventListener('DOMContentLoaded', () => {
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
