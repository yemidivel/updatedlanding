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
  hamburgers.forEach(hamburger => {
    const header = hamburger.closest('.navbar');
    if (!header) return;
    const nav = header.querySelector('nav');
    if (!nav) return;

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('mobile-open');
      hamburger.classList.toggle('active');
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', function(e) {
    document.querySelectorAll('nav.mobile-open').forEach(nav => {
      const header = nav.closest('.navbar');
      if (header && !header.contains(e.target)) {
        nav.classList.remove('mobile-open');
        const hamburger = header.querySelector('.hamburger');
        if (hamburger) {
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
});
