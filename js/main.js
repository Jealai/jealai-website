/* =============================================
   JEAL.AI -- main.js
   ============================================= */

// ===== Text Rotator =====
(function () {
  const words = ['Business', 'Growth', 'Logistics', 'Media', 'Sales'];
  const INTERVAL = 3200;   // ms between word changes
  const EXIT_MS  = 380;    // must match CSS wordExit duration

  const rotator = document.getElementById('rotator');
  if (!rotator) return;

  let currentIndex = 0;

  // Build word spans
  const spans = words.map(function (word) {
    const span = document.createElement('span');
    span.className = 'rotator-word';
    span.textContent = word;
    rotator.appendChild(span);
    return span;
  });

  // Show first word immediately
  spans[0].classList.add('entering');

  // Cycle
  setInterval(function () {
    const current = spans[currentIndex];
    const nextIndex = (currentIndex + 1) % words.length;
    const next = spans[nextIndex];

    // Exit current word
    current.classList.remove('entering');
    current.classList.add('exiting');

    // After exit completes, enter next word
    setTimeout(function () {
      current.classList.remove('exiting');
      next.classList.add('entering');
      currentIndex = nextIndex;
    }, EXIT_MS);

  }, INTERVAL);
})();


// ===== Mobile Menu =====
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close when a link is tapped
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when tapping outside
  document.addEventListener('click', function (e) {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();


// ===== Navbar -- scrolled state =====
(function () {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  function updateNav() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();


// ===== Scroll reveal =====
(function () {
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();


// ===== Footer year =====
(function () {
  var el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();
