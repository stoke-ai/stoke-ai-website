document.querySelector('[data-year]').textContent = new Date().getFullYear();

const header = document.querySelector('[data-header]');
const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 30);
window.addEventListener('scroll', syncHeader, { passive: true });
syncHeader();
