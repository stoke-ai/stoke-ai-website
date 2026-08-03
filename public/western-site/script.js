document.querySelector('[data-year]').textContent = new Date().getFullYear();

const header = document.querySelector('[data-header]');
const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 30);
window.addEventListener('scroll', syncHeader, { passive: true });
syncHeader();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const scrollToSection = (hash, behavior = prefersReducedMotion.matches ? 'auto' : 'smooth') => {
  if (!hash || hash === '#') return false;

  let target;
  try {
    target = document.querySelector(hash);
  } catch {
    return false;
  }

  if (!target) return false;
  target.scrollIntoView({ behavior, block: 'start' });
  return true;
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    if (!scrollToSection(hash)) return;

    event.preventDefault();
    const nextUrl = `${window.location.pathname}${window.location.search}${hash}`;
    if (window.location.hash === hash) {
      window.history.replaceState(null, '', nextUrl);
    } else {
      window.history.pushState(null, '', nextUrl);
    }
  });
});

window.addEventListener('popstate', () => {
  if (window.location.hash) scrollToSection(window.location.hash, 'auto');
});

window.addEventListener('load', async () => {
  if (!window.location.hash) return;
  await document.fonts?.ready;
  window.requestAnimationFrame(() => scrollToSection(window.location.hash, 'auto'));
});
