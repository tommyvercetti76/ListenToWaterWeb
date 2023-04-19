const menuItems = document.getElementById("menu-items");
const hamburgerMenu = document.querySelector(".hamburger-menu");
const pageContainer = document.querySelector(".page-container");
const closePage = document.querySelector(".close-page");

function toggleMenu() {
  menuItems.classList.toggle("open");
  hamburgerMenu.classList.toggle("open");
}

function openPage(e, url) {
  e.preventDefault();
  if (window.innerWidth <= 768) {
    hamburgerMenu.classList.add("mobile-hidden");
    pageContainer.classList.add("open");
    document.querySelector(".content-iframe").src = url;
    document.querySelector(".content-iframe").style.display = "block";
    document.querySelector(".close-btn").style.display = "block";
  } else {
    window.location.href = url;
  }
}

function closePageHandler() {
  hamburgerMenu.classList.remove("mobile-hidden");
  pageContainer.classList.remove("open");
  document.querySelector(".content-iframe").style.display = "none";
  document.querySelector(".close-btn").style.display = "none";
}

hamburgerMenu.addEventListener("click", toggleMenu);
closePage.addEventListener("click", closePageHandler);

document.querySelectorAll(".menu-items li a").forEach((menuItem) => {
  menuItem.addEventListener("click", (e) => openPage(e, menuItem.getAttribute("href")));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    hamburgerMenu.classList.remove("mobile-hidden");
  }
});
