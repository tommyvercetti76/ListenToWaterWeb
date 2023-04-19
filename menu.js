function openPage(url) {
  const contentIframe = document.getElementById("content-iframe");
  const closeBtn = document.getElementById("close-btn");

  contentIframe.src = url;
  contentIframe.style.display = "block";
  contentIframe.style.opacity = 0;
  closeBtn.style.display = "block";

  setTimeout(() => {
    contentIframe.style.opacity = 1;
    contentIframe.style.transition = "opacity 0.5s ease-in-out";
  }, 100);
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
