'use strict';
(() => {
  const scroll = window.ScrollCraft ? window.ScrollCraft.mount(document.body) : null;
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('[data-tech]')];
  const count = document.querySelector('#project-count');
  const explorer = document.querySelector('.project-explorer');
  const track = document.querySelector('.connection-track');
  const context = document.querySelector('#filter-context');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function connect(button) {
    const b = button.getBoundingClientRect();
    const t = track.getBoundingClientRect();
    track.style.setProperty('--connection-x', `${b.left - t.left + b.width / 2}px`);
  }
  function filter(button) {
    const selected = button.dataset.filter;
    let total = 0;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    projects.forEach(project => {
      const show = selected === 'all' || project.dataset.tech.split(' ').includes(selected);
      project.hidden = !show;
      project.querySelectorAll('[data-stack]').forEach(tag => {
        tag.classList.toggle('is-connected', show && selected !== 'all' && tag.dataset.stack === selected);
      });
      if (show) total++;
    });
    count.textContent = `${total} ${total === 1 ? 'projeto' : 'projetos'}`;
    context.textContent = selected === 'all'
      ? 'Da tecnologia à decisão: explore o problema e as escolhas de cada projeto.'
      : `${button.textContent.trim()} em ${total} ${total === 1 ? 'projeto' : 'projetos'}. A tecnologia selecionada está destacada em cada resultado.`;
    connect(button);
    // Prevent a layout collapse from leaving the selected control above the viewport.
    if (explorer.getBoundingClientRect().top < 0) explorer.scrollIntoView({block:'start',behavior:'instant'});
    scroll?.layout();
    reveal();
  }
  buttons.forEach(button => button.addEventListener('click', () => filter(button)));
  document.querySelectorAll('.project details').forEach(details => {
    details.addEventListener('toggle', () => { scroll?.layout(); reveal(); });
  });
  window.addEventListener('resize', () => connect(buttons.find(b => b.getAttribute('aria-pressed') === 'true')));
  connect(buttons[0]);
  const section = document.querySelector('.projects');
  let queued = false;
  function reveal() {
    const p = parseFloat(getComputedStyle(section).getPropertyValue('--sc-p')) || 0;
    section.style.setProperty('--reveal', reduced.matches ? 1 : Math.min(1, p * 4));
    queued = false;
  }
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(reveal); }
  }, { passive:true });
  reduced.addEventListener('change', reveal);
  reveal();
})();
