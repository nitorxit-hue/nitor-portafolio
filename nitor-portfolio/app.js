/* NITOR 3.0 — Lógica del sitio. Los contenidos se editan en config.js. */
(() => {
  'use strict';
  document.documentElement.classList.replace('no-js', 'js');

  const cfg = window.NITOR_CONFIG || {};
  const WA = String(cfg.whatsapp || '584121354734').replace(/\D/g, '');
  const categories = Array.isArray(cfg.categories) ? cfg.categories : [];
  const catMap = Object.fromEntries(categories.map(c => [c.key, c]));
  const videos = (Array.isArray(cfg.videos) ? cfg.videos : []).filter(v => v && v.id);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const el = (tag, props = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('data-') || k.startsWith('aria-') || k === 'role' || k === 'type' || k === 'href') node.setAttribute(k, v);
      else node[k] = v;
    });
    children.forEach(c => c && node.append(c));
    return node;
  };
  const pad = n => String(n).padStart(2, '0');
  const catLabel = key => (catMap[key] && catMap[key].label) || 'VIDEO';
  const catTitle = key => (catMap[key] && catMap[key].title) || 'Otro';
  const isWide = v => v.format === 'horizontal';
  const countFor = key => videos.filter(v => v.category === key).length;
  const playIcon = () => {
    const span = el('span', { class: 'play', 'aria-hidden': 'true' });
    span.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';
    return span;
  };

  /* ---------- Thumbnails: custom → oardefault (vertical) → maxres → hq ---------- */
  function setThumb(img, video) {
    if (video.thumbnail) { img.src = video.thumbnail; return; }
    const id = encodeURIComponent(video.id);
    const chain = isWide(video)
      ? [`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`, `https://i.ytimg.com/vi/${id}/hqdefault.jpg`]
      : [`https://i.ytimg.com/vi/${id}/oardefault.jpg`, `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`, `https://i.ytimg.com/vi/${id}/hqdefault.jpg`];
    let i = 0;
    const next = () => { if (i < chain.length) img.src = chain[i++]; };
    img.addEventListener('load', () => { if (img.naturalWidth <= 120 && i < chain.length) next(); });
    img.addEventListener('error', next);
    next();
  }

  const embedUrl = id => `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;
  function makeFrame(video) {
    const frame = document.createElement('iframe');
    frame.src = embedUrl(video.id);
    frame.title = `Reproductor: ${video.title || 'Proyecto NITOR'}`;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    return frame;
  }

  /* ---------- Navigation ---------- */
  const top = $('#top');
  const menu = $('#menu');
  const toggle = $('#menuToggle');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    top.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    $('.sr-only', toggle).textContent = open ? 'Cerrar menú' : 'Abrir menú';
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); toggle.focus(); } });
  window.matchMedia('(min-width: 961px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  const onScroll = () => top.classList.toggle('scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const navLinks = $$('[data-nav]');
  const sectionIds = navLinks.map(a => a.getAttribute('href').slice(1));
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => {
        const active = a.getAttribute('href') === '#' + entry.target.id;
        a.classList.toggle('active', active);
        if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sectionIds.forEach(id => { const s = document.getElementById(id); if (s) navObserver.observe(s); });

  /* ---------- Featured (hero) ---------- */
  const featured = videos.find(v => v.id === cfg.featuredId) || videos.find(v => v.featured) || videos[0];
  if (featured) {
    const btn = $('#featuredPlayer');
    const img = $('#featuredImg');
    setThumb(img, featured);
    img.alt = `Miniatura de ${featured.title}`;
    btn.setAttribute('aria-label', `Reproducir trabajo destacado: ${featured.title}`);
    $('#featuredTitle').textContent = featured.title || 'Proyecto destacado';
    $('#featuredCat').textContent = catTitle(featured.category);
    $('#featuredQuote').dataset.category = featured.category;
    $('#featuredQuote').setAttribute('data-quote', '');
    if (isWide(featured)) btn.style.aspectRatio = '16 / 9';
    btn.addEventListener('click', () => {
      const frame = makeFrame(featured);
      const holder = el('div', { class: 'featured-player', role: 'region', 'aria-label': `Reproduciendo ${featured.title}` });
      if (isWide(featured)) holder.style.aspectRatio = '16 / 9';
      holder.append(frame);
      btn.replaceWith(holder);
      frame.focus();
    }, { once: true });
  } else {
    $('#featured').hidden = true;
  }

  /* ---------- Quick category chips (hero) ---------- */
  const quick = $('#quickCats');
  categories.forEach(c => {
    const b = el('button', { type: 'button' }, [document.createTextNode(c.title + ' '), el('small', { text: pad(countFor(c.key)) })]);
    b.setAttribute('aria-label', `Ver ${c.title}: ${countFor(c.key)} proyectos`);
    b.addEventListener('click', () => { applyFilter(c.key); scrollToId('portafolio'); });
    quick.append(b);
  });

  /* ---------- Category cards ---------- */
  const catsRoot = $('#cats');
  categories.forEach((c, i) => {
    const n = countFor(c.key);
    const cover = el('div', { class: 'cat-cover' });
    const img = el('img', { alt: '', loading: 'lazy', decoding: 'async' });
    const sample = videos.find(v => v.category === c.key);
    if (c.cover) img.src = c.cover; else if (sample) setThumb(img, sample);
    if (c.cover || sample) cover.append(img);
    cover.append(
      el('span', { class: 'cat-count' }, [el('b', { text: pad(n) }), document.createTextNode(n === 1 ? ' proyecto' : ' proyectos')]),
      el('span', { class: 'cat-num', 'aria-hidden': 'true', text: pad(i + 1) })
    );
    const explore = el('button', { class: 'btn primary sm', type: 'button', text: 'Ver ejemplos' });
    explore.setAttribute('aria-label', `Ver ejemplos de ${c.title}`);
    explore.addEventListener('click', () => { applyFilter(c.key); scrollToId('portafolio'); });
    const quoteBtn = el('a', { class: 'btn ghost sm', href: '#cotizar', text: 'Cotizar', 'data-quote': '', 'data-category': c.key });
    quoteBtn.setAttribute('aria-label', `Cotizar edición de ${c.title}`);
    const card = el('article', { class: 'cat reveal', 'data-cat': c.key }, [
      cover,
      el('div', { class: 'cat-body' }, [
        el('h3', { text: c.title }),
        el('p', { text: c.description || '' }),
        el('div', { class: 'cat-actions' }, [explore, quoteBtn])
      ])
    ]);
    catsRoot.append(card);
  });

  /* ---------- Gallery + filters ---------- */
  const gallery = $('#gallery');
  const empty = $('#empty');
  const filtersRoot = $('#filters');
  const status = $('#filterStatus');
  let currentFilter = 'all';

  videos.forEach((v, i) => {
    const thumb = el('button', { class: 'card-thumb', type: 'button' });
    thumb.setAttribute('aria-label', `Reproducir ${v.title || 'proyecto ' + (i + 1)} (${catTitle(v.category)})`);
    const img = el('img', { alt: '', loading: 'lazy', decoding: 'async', width: isWide(v) ? 640 : 360, height: 640 });
    setThumb(img, v);
    thumb.append(img, playIcon(), el('span', { class: 'tag', text: catLabel(v.category) }), el('span', { class: 'dur', 'aria-hidden': 'true', text: pad(i + 1) }));
    thumb.addEventListener('click', () => openModal(v, thumb));
    const card = el('article', { class: 'card' + (isWide(v) ? ' wide' : ''), 'data-category': v.category || '' }, [
      thumb,
      el('div', {}, [el('h3', { text: v.title || `Proyecto ${pad(i + 1)}` }), el('p', { text: v.description || '' })])
    ]);
    gallery.append(card);
  });

  const filterDefs = [{ key: 'all', label: 'TODOS', n: videos.length }].concat(categories.map(c => ({ key: c.key, label: c.label, n: countFor(c.key) })));
  filterDefs.forEach(f => {
    const b = el('button', { class: 'filter', type: 'button', 'data-filter': f.key, 'aria-pressed': String(f.key === 'all') }, [document.createTextNode(f.label + ' '), el('span', { text: pad(f.n) })]);
    b.addEventListener('click', () => applyFilter(f.key));
    filtersRoot.append(b);
  });

  function applyFilter(key) {
    if (!filterDefs.some(f => f.key === key)) key = 'all';
    currentFilter = key;
    $$('.filter', filtersRoot).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === key)));
    $$('.cat', catsRoot).forEach(c => c.classList.toggle('selected', c.dataset.cat === key));
    const cards = $$('.card', gallery);
    let shown = 0;
    cards.forEach(card => {
      const visible = key === 'all' || card.dataset.category === key;
      if (visible) shown++;
      if (reduceMotion) { card.hidden = !visible; return; }
      if (visible) {
        card.hidden = false;
        card.classList.add('out');
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove('out')));
      } else {
        card.hidden = true;
      }
    });
    empty.hidden = shown > 0;
    const label = key === 'all' ? 'todas las categorías' : catTitle(key);
    status.textContent = `Mostrando ${shown} ${shown === 1 ? 'proyecto' : 'proyectos'} de ${label}.`;
    if (key !== 'all') setQuoteCategory(key, false);
  }
  empty.hidden = videos.length > 0;
  $('[data-quote-current]', empty).addEventListener('click', () => setQuoteCategory(currentFilter === 'all' ? '' : currentFilter, true));

  /* ---------- Modal player ---------- */
  const modal = $('#modal');
  const modalPlayer = $('#modalPlayer');
  let lastTrigger = null;
  let modalVideo = null;
  function openModal(video, trigger) {
    lastTrigger = trigger;
    modalVideo = video;
    modal.classList.toggle('wide', isWide(video));
    $('#modalTitle').textContent = video.title || 'Proyecto NITOR';
    $('#modalDesc').textContent = video.description || '';
    $('#modalCat').textContent = catTitle(video.category);
    $('#modalYT').href = isWide(video) ? `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}` : `https://www.youtube.com/shorts/${encodeURIComponent(video.id)}`;
    modalPlayer.replaceChildren(makeFrame(video));
    if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    $('#modalClose').focus();
  }
  function closeModal() {
    if (modal.open) modal.close();
  }
  modal.addEventListener('close', () => {
    modalPlayer.replaceChildren();
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  });
  $('#modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal || e.target.classList.contains('modal-inner')) closeModal(); });
  $('#modalQuote').addEventListener('click', e => {
    e.preventDefault();
    const cat = modalVideo && modalVideo.category;
    lastTrigger = null;
    closeModal();
    setQuoteCategory(cat, true);
  });

  /* ---------- Quote form ---------- */
  const form = $('#quoteForm');
  const qService = $('#qService');
  const qCategory = $('#qCategory');
  const qType = $('#qType');
  const qQty = $('#qQty');
  const qCustom = $('#qCustom');
  const customField = $('#customField');
  const customError = $('#customError');
  const totalEl = $('#total');
  const budgets = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  categories.forEach(c => qCategory.append(el('option', { value: c.key, text: c.title })));
  qCategory.append(el('option', { value: 'otro', text: 'Otro / no estoy seguro' }));

  function fillTypes() {
    const c = catMap[qCategory.value];
    const types = (c && c.videoTypes && c.videoTypes.length) ? c.videoTypes : ['Lo definimos juntos'];
    qType.replaceChildren(...types.map(t => el('option', { text: t })), el('option', { text: 'Otro tipo de video' }));
  }
  qCategory.addEventListener('change', fillTypes);
  fillTypes();

  const chips = $('#budgetChips');
  budgets.concat(['custom']).forEach(b => {
    const input = el('input', { type: 'radio', name: 'budget', value: String(b), checked: b === 50 });
    input.id = 'budget-' + b;
    const label = el('label', { class: 'chip' }, [input, el('span', { text: b === 'custom' ? 'Otro monto' : `$${b}` })]);
    label.htmlFor = input.id;
    chips.append(label);
  });

  const budgetValue = () => (form.querySelector('input[name="budget"]:checked') || {}).value || '50';
  const amount = () => budgetValue() === 'custom' ? Number(qCustom.value || 0) : Number(budgetValue());
  const money = n => '$' + Number(n).toLocaleString('en-US') + ' USD';
  function updateTotal() {
    const isCustom = budgetValue() === 'custom';
    customField.hidden = !isCustom;
    const n = amount();
    totalEl.textContent = n > 0 ? money(n) : '—';
    if (n > 0) customError.hidden = true;
  }
  chips.addEventListener('change', () => {
    updateTotal();
    if (budgetValue() === 'custom') qCustom.focus();
  });
  qCustom.addEventListener('input', updateTotal);

  const clampQty = v => Math.min(100, Math.max(1, Math.round(Number(v) || 1)));
  $('#qtyMinus').addEventListener('click', () => { qQty.value = clampQty(Number(qQty.value) - 1); });
  $('#qtyPlus').addEventListener('click', () => { qQty.value = clampQty(Number(qQty.value) + 1); });
  qQty.addEventListener('change', () => { qQty.value = clampQty(qQty.value); });

  function setQuoteCategory(key, scroll) {
    if (key && catMap[key]) {
      if (qCategory.value !== key) { qCategory.value = key; fillTypes(); }
    }
    if (scroll) scrollToId('cotizar', qCategory);
  }

  document.addEventListener('click', e => {
    const link = e.target.closest('[data-quote]');
    if (!link) return;
    e.preventDefault();
    if (link.dataset.service) qService.value = link.dataset.service;
    setQuoteCategory(link.dataset.category, true);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const n = amount();
    if (!n || n < 1) { customError.hidden = false; qCustom.focus(); return; }
    const name = $('#qName').value.trim();
    const details = $('#qDetails').value.trim();
    const catText = qCategory.options[qCategory.selectedIndex].text;
    const lines = [
      '¡Hola, NITOR! Quiero solicitar una cotización.',
      '',
      name ? `• Nombre: ${name}` : null,
      `• Tipo de edición: ${qService.value}`,
      `• Categoría: ${catText}`,
      `• Tipo de video: ${qType.value}`,
      `• Duración aproximada: ${$('#qDuration').value}`,
      `• Cantidad de videos: ${clampQty(qQty.value)}`,
      `• Presupuesto estimado: ${money(n)}${budgetValue() === 'custom' ? ' (personalizado)' : ''}`,
      `• Descripción: ${details || 'Quiero conversar sobre mi proyecto.'}`,
      '',
      '¿Podemos conversar los detalles?'
    ].filter(l => l !== null);
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
  updateTotal();

  /* ---------- Contact links & socials ---------- */
  $$('[data-wa]').forEach(a => { a.href = `https://wa.me/${WA}`; });
  const socials = cfg.socials || {};
  const socialNames = { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube' };
  ['socials', 'footSocials'].forEach(id => {
    const root = document.getElementById(id);
    Object.entries(socialNames).forEach(([k, label]) => {
      const url = (socials[k] || '').trim();
      if (!/^https?:\/\//i.test(url)) return;
      const a = el('a', { href: url, text: label + ' ↗', target: '_blank', rel: 'noopener' });
      a.setAttribute('aria-label', `NITOR en ${label} (se abre en una pestaña nueva)`);
      root.append(a);
    });
    if (!root.children.length) root.hidden = true;
  });
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Floating contact visibility ---------- */
  const dock = $('#dock');
  const waFloat = $('.wa-float');
  const hero = $('#inicio');
  const quoteSection = $('#cotizar');
  const contactSection = $('#contacto');
  const vis = { hero: true, quote: false, contact: false };
  const syncFloat = () => {
    const hideAll = vis.quote || vis.contact;
    dock.classList.toggle('show', !vis.hero && !hideAll);
    waFloat.classList.toggle('hide', hideAll);
  };
  new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.target === hero) vis.hero = en.isIntersecting;
      if (en.target === quoteSection) vis.quote = en.isIntersecting;
      if (en.target === contactSection) vis.contact = en.isIntersecting;
    });
    syncFloat();
  }, { threshold: 0.15 }).observe(hero);
  const floatObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.target === quoteSection) vis.quote = en.isIntersecting;
      if (en.target === contactSection) vis.contact = en.isIntersecting;
    });
    syncFloat();
  }, { threshold: 0.2 });
  floatObs.observe(quoteSection);
  floatObs.observe(contactSection);

  /* ---------- Reveal on scroll ---------- */
  function scrollToId(id, focusEl) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    if (focusEl) setTimeout(() => focusEl.focus({ preventScroll: true }), reduceMotion ? 0 : 600);
  }
  const reveals = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(r => r.classList.add('in'));
  } else {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const siblings = Array.from(en.target.parentElement.children).filter(n => n.classList.contains('reveal'));
        en.target.style.transitionDelay = Math.min(siblings.indexOf(en.target), 5) * 70 + 'ms';
        en.target.classList.add('in');
        ro.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(r => ro.observe(r));
  }
})();
