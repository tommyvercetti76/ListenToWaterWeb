document.querySelectorAll(".menu-items li a").forEach((link) =>
  link.addEventListener("click", (event) => {
    if (isMobile()) {
      event.preventDefault();
      closeMenu();
      openPage(link.href);
    }
  })
);
