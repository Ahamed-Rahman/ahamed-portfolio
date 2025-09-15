// ================= Smooth Scroll =================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return; // safety
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ========== Extra portfolio interactivity ==========

// 1) Highlight nav link on scroll (with rAF)
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav ul li a");
let ticking = false;

function activateNav() {
  const scrollY = window.scrollY + 150; // offset
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(link => link.classList.remove("active"));
      const active = document.querySelector(`nav ul li a[href="#${sec.id}"]`);
      if (active) active.classList.add("active");
    }
  });
}

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      activateNav();
      ticking = false;
    });
    ticking = true;
  }
}
window.addEventListener("scroll", onScroll, { passive: true });
// run once on load
activateNav();

// 2) Scroll-reveal fade-in
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document
  .querySelectorAll(".project-card, .skill-card, .experience-card, .contact-info, .contact-form")
  .forEach(el => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

// 3) Contact form (demo handler)
const form = document.querySelector(".contact-form form");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("Thanks! Your message has been recorded. (Demo only)");
    form.reset();
  });
}

// ================== Theme Toggle ==================
(function(){
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');

  // Determine initial theme: saved -> system -> default dark
  const saved = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = saved ?? (systemPrefersLight ? 'light' : 'dark');
  setTheme(initial);

  // Toggle on click
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      setTheme(next);
    });
  }

  // React to OS theme changes if user hasn't chosen manually
  const mq = window.matchMedia('(prefers-color-scheme: light)');
  if (mq.addEventListener) {
    mq.addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'light' : 'dark');
      }
    });
  } else if (mq.addListener) {
    // Safari <14 fallback
    mq.addListener(e => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'light' : 'dark');
      }
    });
  }

  function setTheme(mode){
    // Smooth transition
    root.classList.add('theme-transition');
    clearTimeout(window.__themeTimeout);
    window.__themeTimeout = setTimeout(() => root.classList.remove('theme-transition'), 250);

    if (mode === 'light') {
      root.setAttribute('data-theme','light');
      localStorage.setItem('theme','light');
      updateToggleUI('light');
    } else {
      root.setAttribute('data-theme','dark');
      localStorage.setItem('theme','dark');
      updateToggleUI('dark');
    }
  }

  function updateToggleUI(mode){
    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector('i');
    const label = toggleBtn.querySelector('.toggle-text');
    if (mode === 'light') {
      if (icon) icon.className = 'fas fa-sun';
      if (label) label.textContent = 'Light';
      toggleBtn.setAttribute('aria-pressed','true');
    } else {
      if (icon) icon.className = 'fas fa-moon';
      if (label) label.textContent = 'Dark';
      toggleBtn.setAttribute('aria-pressed','false');
    }
  }
})();
