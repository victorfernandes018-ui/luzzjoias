(() => {
  const body = document.body;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  body.classList.add('is-loading');

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  const finish = () => {
    loader.classList.add('is-done');
    body.classList.remove('is-loading');
    setTimeout(() => body.classList.add('is-ready'), 250);
  };
  window.addEventListener('load', () => setTimeout(finish, reduce ? 0 : 1900));
  setTimeout(finish, 4500); // segurança

  /* ---------- Ano ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Header ---------- */
  const header = document.getElementById('header');
  const darkSections = [...document.querySelectorAll('.moissanite, .cta, .footer, .marquee')];
  const onScrollHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
    const y = header.offsetHeight / 2;
    const overDark = darkSections.some(sec => {
      const r = sec.getBoundingClientRect();
      return r.top <= y && r.bottom >= y;
    });
    header.classList.toggle('is-dark', overDark && !nav.classList.contains('is-open'));
  };

  /* ---------- Menu mobile ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menuBtn.classList.remove('is-open');
    nav.classList.remove('is-open');
  }));

  /* ---------- Comprimento dos traços (desenho) ---------- */
  document.querySelectorAll('.draw-on-scroll').forEach(el => {
    try {
      const len = Math.ceil(el.getTotalLength()) + 2;
      el.style.setProperty('--len', len);
    } catch (e) { /* ignore */ }
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = el.parentElement ? [...el.parentElement.children].filter(c => c.matches('.reveal, .reveal-card, .reveal-img')) : [];
      const i = Math.max(0, siblings.indexOf(el));
      el.style.transitionDelay = `${Math.min(i, 5) * 0.1}s`;
      el.classList.add('is-visible');
      io.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-card, .reveal-img').forEach(el => io.observe(el));

  // ilustrações que se desenham
  const drawIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        drawIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.ring-illus, .gem-big, .map').forEach(el => drawIO.observe(el));

  /* ---------- Estrelas (seção moissanite) ---------- */
  const stars = document.getElementById('stars');
  if (stars) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 90; i++) {
      const s = document.createElement('span');
      s.className = 'star';
      const size = Math.random() < 0.15 ? 3 : Math.random() < 0.5 ? 2 : 1;
      s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;--t:${3 + Math.random() * 4}s;--d:${Math.random() * 4}s`;
      frag.appendChild(s);
    }
    [[78, 12, 1.5], [40, 8, 5.5]].forEach(([x, y, d]) => {
      const sh = document.createElement('span');
      sh.className = 'shooting';
      sh.style.cssText = `left:${x}%;top:${y}%;--d:${d}s`;
      frag.appendChild(sh);
    });
    stars.appendChild(frag);
  }

  /* ---------- Parallax ---------- */
  const parallaxEls = [...document.querySelectorAll('[data-parallax]')];
  const gallery = document.getElementById('gallery');
  let ticking = false;
  const onScroll = () => {
    onScrollHeader();
    if (reduce || ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      parallaxEls.forEach(el => {
        const k = parseFloat(el.dataset.parallax);
        el.style.translate = `0 ${y * k * -1}px`;
      });
      if (gallery) {
        const r = gallery.getBoundingClientRect();
        const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        gallery.style.setProperty('--shift', `${(p - 0.5) * -80}px`);
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Cursor + rastro de brilho ---------- */
  const cursor = document.getElementById('cursor');
  if (window.matchMedia('(hover: hover)').matches && !reduce) {
    let lastTrail = 0;
    window.addEventListener('mousemove', e => {
      cursor.classList.add('is-on');
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      const now = performance.now();
      if (now - lastTrail > 70) {
        lastTrail = now;
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        t.setAttribute('class', 'trail');
        t.innerHTML = '<use href="#sparkle"/>';
        const s = 6 + Math.random() * 8;
        t.style.cssText = `left:${e.clientX + (Math.random() * 16 - 8)}px;top:${e.clientY + (Math.random() * 16 - 8)}px;width:${s}px;height:${s}px`;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 900);
      }
    });
    document.addEventListener('mouseleave', () => cursor.classList.remove('is-on'));
    const HOVER = 'a, button, summary, .g';
    document.addEventListener('mouseover', e => cursor.classList.toggle('is-hover', !!e.target.closest(HOVER)));
  }

  /* ---------- Tilt suave nos cards ---------- */
  if (!reduce) {
    document.querySelectorAll('.card__img').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${y * -6}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
      card.style.transition = 'transform .6s cubic-bezier(.2,.7,.1,1)';
    });
  }
})();
