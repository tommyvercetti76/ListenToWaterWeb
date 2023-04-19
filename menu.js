function fadeIn(element) {
  let opacity = 0;
  element.style.opacity = opacity;
  element.style.display = "block";

  function increaseOpacity() {
    opacity += 0.05;
    if (opacity >= 1) {
      element.style.opacity = 1;
      return;
    }
    element.style.opacity = opacity;
    requestAnimationFrame(increaseOpacity);
  }
  requestAnimationFrame(increaseOpacity);
}

function openPage(url) {
  const contentIframe = document.getElementById("content-iframe");
  const closeBtn = document.getElementById("close-btn");

  contentIframe.src = url;
  contentIframe.classList.add('fade-in', 'visible');
  closeBtn.style.display = "block";
}

function closePage() {
  const contentIframe = document.getElementById("content-iframe");
  const closeBtn = document.getElementById("close-btn");

  contentIframe.src = "";
  contentIframe.classList.remove('visible');
  closeBtn.style.display = "none";
}

document.querySelectorAll('.menu-items a').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    toggleMenu();

    if (isMobile()) {
      openPage(event.target.href);
    } else {
      window.location.href = event.target.href;
    }
  });
});
