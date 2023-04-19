function toggleMenu() {
  const menuItems = document.getElementById('menu-items');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  menuItems.classList.toggle('open');
  hamburgerMenu.classList.toggle('open');
}

function isMobile() {
  return window.innerWidth <= 640;
}

function openPage(url) {
  const contentIframe = document.getElementById("content-iframe");
  const closeBtn = document.getElementById("close-btn");

  contentIframe.style.opacity = 0;
  contentIframe.src = url;
  contentIframe.style.display = "block";
  closeBtn.style.display = "block";

  contentIframe.onload = function () {
    contentIframe.style.opacity = 1;
  };
}

function closePage() {
  const contentIframe = document.getElementById("content-iframe");
  const closeBtn = document.getElementById("close-btn");

  contentIframe.src = "";
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
