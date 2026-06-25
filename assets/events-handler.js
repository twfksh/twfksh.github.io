(function() {
  document.addEventListener('keydown', function(event) {
    var tag = event.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || event.target.isContentEditable) {
      return;
    }

    switch (event.key) {
      case 'l':
        window.location.href = '/';
        break;
      case 'h':
        window.location.href = '/about/';
        break;
    }
  });
})();
