document.addEventListener("DOMContentLoaded", function() {
    var links = document.querySelectorAll('a');
    var currentUrl = window.location.pathname;
    var currentPage = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);

    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});
