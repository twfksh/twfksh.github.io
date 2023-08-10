const navLinks = document.querySelector(".nav-links");

function onToggleMenu() {
  navLinks.classList.toggle("top-[1%]");
}

const navigationLinks = document.querySelectorAll(".nav-links a");
navigationLinks.forEach(link => {
  link.addEventListener("click", () => {
    onToggleMenu(); 
  });
});

const typeSvgEl = document.querySelector('type-svg');

function toggleElVisibility(el) {
  if (window.innerWidth >= 768) {
    el.style.display = "block";
  } else {
    el.style.display = "none";
  }
}

toggleElVisibility(typeSvgEl);

window.addEventListener("resize", toggleElVisibility(typeSvgEl));

const sys_pref = window.matchMedia('(prefers-color-scheme: dark)').matches;

function toggleDarkMode(pref) {
  const html = document.querySelector('html');
  if (pref) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

toggleDarkMode(sys_pref);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  toggleDarkMode(e.matches);
});