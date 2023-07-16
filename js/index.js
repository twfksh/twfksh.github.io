const navLinks = document.querySelector('.nav-links')

function onToggleMenu(e){
    e.name = e.name === 'menu' ? 'close' : 'menu'
    navLinks.classList.toggle('top-[9%]')
}

function blink() {
    const el = document.getElementById('.blink');
    el.classList.toggle('hidden');
}
setInterval(blink, 500); // Adjust the interval (in milliseconds) to control the blink speed