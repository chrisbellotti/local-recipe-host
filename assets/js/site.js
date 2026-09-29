// Index: search + tag filter. Recipe pages: tap to cross off, keep screen awake.
(function () {
  const list = document.getElementById('recipe-list');
  if (list) {
    const items = [...list.children];
    const q = document.getElementById('q');
    const tagBox = document.getElementById('tag-filter');
    const noMatch = document.getElementById('no-match');
    let activeTag = new URLSearchParams(location.search).get('tag') || '';

    // Bookmarked tags are buttons (list comes from pinned_tags in _config.yml).
    // Every other tag is a hidden search keyword.
    const PINNED = (tagBox.dataset.pinned || '').split('|').filter(Boolean);
    const label = t => t.replace(/-/g, ' ');
    const buttons = PINNED.map(t => {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.tag = t;
      b.textContent = label(t);
      b.addEventListener('click', () => setTag(activeTag === t ? '' : t));
      tagBox.appendChild(b);
      return b;
    });
    items.forEach(li => { li.dataset.keywords = label(li.dataset.tags || '').replace(/\|/g, ' ').toLowerCase(); });

    // Old links like ?tag=mexican turn into a search.
    if (activeTag && !PINNED.includes(activeTag)) { q.value = label(activeTag); activeTag = ''; }

    function setTag(t) {
      activeTag = t;
      buttons.forEach(b => b.setAttribute('aria-pressed', b.dataset.tag === t));
      apply();
    }

    function apply() {
      const term = q.value.trim().toLowerCase();
      let shown = 0;
      items.forEach(li => {
        const tagOk = !activeTag || (li.dataset.tags || '').split('|').includes(activeTag);
        const textOk = !term || li.dataset.title.includes(term) || li.dataset.keywords.includes(term) || li.dataset.text.includes(term);
        li.hidden = !(tagOk && textOk);
        if (!li.hidden) shown++;
      });
      noMatch.hidden = shown > 0;
      const url = new URL(location);
      activeTag ? url.searchParams.set('tag', activeTag) : url.searchParams.delete('tag');
      history.replaceState(null, '', url);
    }
    q.addEventListener('input', apply);
    setTag(activeTag);
  }

  const body = document.querySelector('.recipe-body');
  if (body) {
    const findSection = name => [...body.querySelectorAll('h2')].find(h => name.test(h.textContent.trim()));
    // Elements between a heading and the next h2.
    const sectionEls = heading => {
      const els = [];
      for (let el = heading.nextElementSibling; el && el.tagName !== 'H2'; el = el.nextElementSibling) els.push(el);
      return els;
    };

    // Ingredients: tap to cross off, with a small hint under the heading.
    const ingHeading = findSection(/^ingredients$/i);
    if (ingHeading) {
      const hint = document.createElement('p');
      hint.className = 'section-hint';
      hint.textContent = 'Tap ingredients you have in stock to cross them off';
      ingHeading.after(hint);
      sectionEls(hint).forEach(el => {
        (el.matches('li') ? [el] : el.querySelectorAll('li')).forEach(li => {
          li.tabIndex = 0;
          const toggle = () => li.classList.toggle('done');
          li.addEventListener('click', toggle);
          li.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
          });
        });
      });
    }

    // Instructions: a button that opens a paginated step-by-step card.
    const stepHeading = findSection(/^instructions$/i);
    const steps = stepHeading
      ? sectionEls(stepHeading).flatMap(el => [...(el.matches('ol') ? el.children : el.querySelectorAll('ol > li'))])
      : [];
    if (steps.length) {
      const open = document.createElement('button');
      open.type = 'button';
      open.className = 'guide-open';
      open.textContent = 'Open step-by-step guide';
      stepHeading.after(open);

      const dlg = document.createElement('dialog');
      dlg.className = 'guide';
      dlg.setAttribute('aria-label', 'Step-by-step guide');
      dlg.innerHTML = `
        <button type="button" class="guide-close" aria-label="Close">&times;</button>
        <p class="guide-count" aria-live="polite"></p>
        <div class="guide-step"></div>
        <div class="guide-nav">
          <button type="button" class="guide-prev" aria-label="Previous step">&larr;</button>
          <div class="guide-dots"></div>
          <button type="button" class="guide-next" aria-label="Next step">&rarr;</button>
        </div>`;
      document.body.appendChild(dlg);

      const $ = s => dlg.querySelector(s);
      const dots = steps.map((_, i) => {
        const d = document.createElement('button');
        d.type = 'button';
        d.setAttribute('aria-label', `Go to step ${i + 1}`);
        d.addEventListener('click', () => show(i));
        $('.guide-dots').appendChild(d);
        return d;
      });
      let cur = 0;
      function show(i) {
        cur = Math.max(0, Math.min(steps.length - 1, i));
        $('.guide-count').textContent = `Step ${cur + 1} of ${steps.length}`;
        $('.guide-step').innerHTML = steps[cur].innerHTML;
        $('.guide-prev').disabled = cur === 0;
        const last = cur === steps.length - 1;
        $('.guide-next').innerHTML = last ? 'Done' : '&rarr;';
        $('.guide-next').setAttribute('aria-label', last ? 'Finish' : 'Next step');
        $('.guide-next').classList.toggle('is-done', last);
        dots.forEach((d, j) => d.setAttribute('aria-current', j === cur ? 'step' : 'false'));
      }
      $('.guide-prev').addEventListener('click', () => show(cur - 1));
      $('.guide-next').addEventListener('click', () => cur === steps.length - 1 ? dlg.close() : show(cur + 1));
      $('.guide-close').addEventListener('click', () => dlg.close());
      dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
      dlg.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') show(cur + 1);
        if (e.key === 'ArrowLeft') show(cur - 1);
      });
      let x0 = null;
      dlg.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
      dlg.addEventListener('touchend', e => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
        x0 = null;
      });
      open.addEventListener('click', () => { show(0); dlg.showModal(); });
    }
    if ('wakeLock' in navigator) {
      const lock = () => navigator.wakeLock.request('screen').catch(() => {});
      lock();
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') lock();
      });
    }
  }
})();
