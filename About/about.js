/* =========================
   HAMBURGER MENU
========================= */

const hamburger =
document.querySelector(".hamburger");

const navLinks =
document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {

  hamburger.classList.toggle("open");

  navLinks.classList.toggle("active");

});

/* =========================
   CLOSE MENU ON LINK CLICK
========================= */

document
.querySelectorAll(".nav-links a")
.forEach(link => {

  link.addEventListener("click", () => {

    hamburger.classList.remove("open");

    navLinks.classList.remove("active");

  });

});