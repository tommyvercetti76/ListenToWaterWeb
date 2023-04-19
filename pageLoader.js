function openPage(url) {
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        document.getElementById("page-content").innerHTML = html;
        const pageContainer = document.getElementById("page-container");
        pageContainer.classList.add("open");
      })
      .catch((error) => {
        console.warn(`Error fetching page: ${url}`, error);
      });
  }
  
  function closePage() {
    const pageContainer = document.getElementById("page-container");
    pageContainer.classList.remove("open");
  }
  
  document
    .querySelectorAll(".menu-items li a")
    .forEach((link) =>
      link.addEventListener("click", (event) => {
        event.preventDefault();
        closeMenu();
        openPage(link.getAttribute("href"));
      })
    );

    function isMobile() {
        return window.innerWidth <= 768;
      }
      
      document.querySelectorAll(".menu-items li a").forEach((link) =>
        link.addEventListener("click", (event) => {
          if (isMobile()) {
            event.preventDefault();
            closeMenu();
            openPage(link.getAttribute("href"));
          }
        })
      );
      
  