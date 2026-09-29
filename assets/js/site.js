// Index: search + tag filter. Recipe pages: tap to cross off, keep screen awake.
(function () {
  const list = document.getElementById('recipe-list');
  if (list) {
    const items = [...list.children];
    const q = document.getElementById('q');
    const tagBox = document.getElementById('tag-filter');
    const noMatch = document.getElementById('no-match');
    let activeTag = new URLSearchParams(location.search).get('tag') || '';

    const tags = [...new Set(items.flatMap(li => (li.dataset.tags || '').split('|').filter(Boolean)))].sort();
    tags.forEach(t => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = t;
      b.setAttribute('aria-pressed', t === activeTag);
      b.addEventListener('click', () => {
        activeTag = activeTag === t ? '' : t;
        tagBox.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x.textContent === activeTag));
        apply();
      });
      tagBox.appendChild(b);
    });

    function apply() {
      const term = q.value.trim().toLowerCase();
      let shown = 0;
      items.forEach(li => {
        const tagOk = !activeTag || (li.dataset.tags || '').split('|').includes(activeTag);
        const textOk = !term || li.dataset.title.includes(term) || li.dataset.text.includes(term);
        li.hidden = !(tagOk && textOk);
        if (!li.hidden) shown++;
      });
      noMatch.hidden = shown > 0;
      const url = new URL(location);
      activeTag ? url.searchParams.set('tag', activeTag) : url.searchParams.delete('tag');
      history.replaceState(null, '', url);
    }
    q.addEventListener('input', apply);
    apply();
  }

  const body = document.querySelector('.recipe-body');
  if (body) {
    // Ingredients and Instructions: tap to cross off, with a small hint under each heading.
    const sections = [
      [/^ingredients$/i, 'Tap ingredients to cross them off'],
      [/^instructions$/i, 'Tap a step to mark it done'],
    ];
    sections.forEach(([name, text]) => {
      const heading = [...body.querySelectorAll('h2')].find(h => name.test(h.textContent.trim()));
      if (!heading) return;
      const hint = document.createElement('p');
      hint.className = 'section-hint';
      hint.textContent = text;
      heading.after(hint);
      for (let el = hint.nextElementSibling; el && el.tagName !== 'H2'; el = el.nextElementSibling) {
        const items = el.matches('li') ? [el] : el.querySelectorAll('li');
        items.forEach(li => {
          li.tabIndex = 0;
          const toggle = () => li.classList.toggle('done');
          li.addEventListener('click', toggle);
          li.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
          });
        });
      }
    });
    if ('wakeLock' in navigator) {
      const lock = () => navigator.wakeLock.request('screen').catch(() => {});
      lock();
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') lock();
      });
    }
  }
})();
