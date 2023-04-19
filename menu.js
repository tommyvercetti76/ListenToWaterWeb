function openPage(url) {
  const contentIframe = document.getElementById("content-iframe");
  const closeBtn = document.getElementById("close-btn");

  contentIframe.src = url;
  contentIframe.classList.add('loading');
  contentIframe.style.display = "block";
  closeBtn.style.display = "block";
}

function closePage() {
  const contentIframe = document.getElementById("content-iframe");
  const closeBtn = document.getElementById("close-btn");

  contentIframe.src = "";
  contentIframe.classList.remove('visible');
  contentIframe.style.display = "none";
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

document.getElementById('content-iframe').addEventListener('load', function() {
  this.classList.remove('loading');
  this.classList.add('visible');
});
