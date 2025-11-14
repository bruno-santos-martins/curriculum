// script.js - Bruno Martins Curriculum

// Navegação suave para âncoras
const navLinks = document.querySelectorAll('.nav a');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const section = document.querySelector(href);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Destaque de seção ao rolar
const sections = document.querySelectorAll('main section');
function updateActiveLink() {
  let scrollPos = window.scrollY || window.pageYOffset;
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    const bottom = top + section.offsetHeight;
    const navLink = document.querySelector('.nav a[href="#' + section.id + '"]');
    if (scrollPos >= top && scrollPos < bottom) {
      navLink && navLink.classList.add('active');
    } else {
      navLink && navLink.classList.remove('active');
    }
  });
}
window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);

// Reveal animation for cards
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));
} else {
  // Fallback
  reveals.forEach(el => el.classList.add('show'));
}

// Dark mode toggle with persistence
const root = document.documentElement;
const toggleBtn = document.getElementById('themeToggle');
const storedTheme = localStorage.getItem('theme');
if (storedTheme) {
  root.setAttribute('data-theme', storedTheme);
}
toggleBtn && toggleBtn.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', current);
  localStorage.setItem('theme', current);
});
