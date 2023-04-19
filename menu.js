function openPage(url) {
  const contentIframe = document.getElementById("content-iframe");
  const closeBtn = document.getElementById("close-btn");

  contentIframe.src = url;
  contentIframe.classList.add('loading');
  closeBtn.style.display = "block";

  contentIframe.onload = () => {
    contentIframe.classList.remove('loading');
    contentIframe.classList.add('visible');
  };
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
