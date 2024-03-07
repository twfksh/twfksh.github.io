document.addEventListener("DOMContentLoaded", function() {
    var links = document.querySelectorAll('a');
    var currentUrl = window.location.pathname;
    var currentPage = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);

    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    var resumeLink = document.querySelector('.resume-link');

    resumeLink.addEventListener('click', event => {
        if (resumeLink.getAttribute('href') === '#') {
            event.preventDefault();
            alert("Apologies, the resume is not available at the moment.");
        }
    });
});
