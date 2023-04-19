function toggleMenu() {
  const menuItems = document.getElementById('menu-items');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  menuItems.classList.toggle('open');
  hamburgerMenu.classList.toggle('open');
}
