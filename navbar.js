//navbar

const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

// Toggle menú hamburguesa
hamburger.addEventListener("click", () => {
  menu.classList.toggle("show");
});

// close menu after click 
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove("show");
  });
});
