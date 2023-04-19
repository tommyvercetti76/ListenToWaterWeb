function toggleMenu() {
  const menuItems = document.getElementById("menu-items");
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  menuItems.classList.toggle("open");
  hamburgerMenu.classList.toggle("open");
}

function openPage(url) {
  const contentIframe = document.getElementById("content-iframe");
  const closeBtn = document.getElementById("close-btn");

  contentIframe.src = url;
  contentIframe.classList.add("visible");
  closeBtn.style.display = "block";
}

function closePage() {
  const contentIframe = document.getElementById("content-iframe");
  const closeBtn = document.getElementById("close-btn");

  contentIframe.src = "";
  contentIframe.classList.remove("visible");
  closeBtn.style.display = "none";
}

function isMobile() {
  return window.innerWidth <= 640;
}

document.querySelectorAll(".menu-items a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    toggleMenu();
    window.location.href = event.target.href;
  });
});
