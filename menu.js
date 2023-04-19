const menuItems = document.getElementById("menu-items");
const hamburgerMenu = document.querySelector(".hamburger-menu");
const contentIframe = document.getElementById("content-iframe");
const closeBtn = document.getElementById("close-btn");

function toggleMenu() {
  menuItems.classList.toggle("open");
  hamburgerMenu.classList.toggle("open");
}

function openPage(e, url) {
  e.preventDefault();
  if (window.innerWidth <= 768) {
    toggleMenu();
    hamburgerMenu.style.display = "none";
    contentIframe.src = url;
    contentIframe.style.display = "block";
    closeBtn.style.display = "block";
  } else {
    window.location.href = url;
  }
}

function closePage() {
  hamburgerMenu.style.display = "block";
  contentIframe.style.display = "none";
  closeBtn.style.display = "none";
}

hamburgerMenu.addEventListener("click", toggleMenu);
closeBtn.addEventListener("click", closePage);

document.querySelectorAll(".menu-items li a").forEach((menuItem) => {
  menuItem.addEventListener("click", (e) => openPage(e, menuItem.getAttribute("href")));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    hamburgerMenu.style.display = "block";
  }
});
