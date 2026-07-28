document.addEventListener('DOMContentLoaded', function() {
  const dropdowns = document.querySelectorAll('.dropdown');
  const hamburgers = document.querySelectorAll('.hamburger');

  // Dropdown Logic (desktop only)
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropbtn');
    const content = dropdown.querySelector('.dropdown-content');

    if (toggle && content) {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        content.classList.toggle('show');
      });

      dropdown.addEventListener('mouseleave', function() {
        content.classList.remove('show');
      });
    }
  });

  document.addEventListener('click', function(e) {
    dropdowns.forEach(dropdown => {
      const content = dropdown.querySelector('.dropdown-content');
      if (content && content.classList.contains('show') && !dropdown.contains(e.target)) {
        content.classList.remove('show');
      }
    });
  });

  let lastY = window.scrollY;
  window.addEventListener('scroll', function() {
    const currentY = window.scrollY;
    if (Math.abs(currentY - lastY) > 5) {
      dropdowns.forEach(dropdown => {
        const content = dropdown.querySelector('.dropdown-content');
        if (content) content.classList.remove('show');
      });
    }
    lastY = currentY;
  }, { passive: true });

  // Mobile Menu Logic
  function isMobile() {
    return window.innerWidth <= 1024;
  }

  function resetAccordion(nav) {
    nav.querySelectorAll('.mega-column').forEach(col => col.classList.remove('open'));
    var dd = nav.querySelector('.dropdown-content');
    if (dd) dd.classList.remove('show');
  }

  hamburgers.forEach(hamburger => {
    const header = hamburger.closest('.navbar');
    if (!header) return;
    const nav = header.querySelector('nav');
    if (!nav) return;

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      var wasOpen = nav.classList.contains('mobile-open');
      nav.classList.toggle('mobile-open');
      hamburger.classList.toggle('active');

      if (wasOpen) {
        resetAccordion(nav);
      }

      var expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
    });

    // Mobile accordion for mega-menu categories
    var megaColumns = nav.querySelectorAll('.mega-column');
    megaColumns.forEach(function(col) {
      var h3 = col.querySelector('h3');
      if (h3) {
        h3.addEventListener('click', function(e) {
          if (!isMobile()) return;
          e.preventDefault();
          e.stopPropagation();
          var isOpen = col.classList.contains('open');
          megaColumns.forEach(function(other) {
            if (other !== col) other.classList.remove('open');
          });
          col.classList.toggle('open', !isOpen);
        });
      }
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', function(e) {
    document.querySelectorAll('nav.mobile-open').forEach(function(nav) {
      var header = nav.closest('.navbar');
      if (header && !header.contains(e.target)) {
        resetAccordion(nav);
        nav.classList.remove('mobile-open');
        var hamburger = header.querySelector('.hamburger');
        if (hamburger) {
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
});
