/* LUZZ — loja, detalhe da peça e sacola (pedido pelo WhatsApp) */
(() => {
  const products = window.LUZZ_PRODUCTS || [];
  const config = window.LUZZ_CONFIG || {};
  const $ = id => document.getElementById(id);

  const CATS = {
    todos: 'Todas',
    brincos: 'Brincos',
    colares: 'Colares & Riviera',
    pingentes: 'Pingentes',
    pulseiras: 'Pulseiras',
    aneis: 'Anéis',
    masculino: 'Masculino'
  };

  const money = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const priceHTML = p => {
    if (p.preco == null || p.preco === '') return '<span class="price price--ask">Sob consulta</span>';
    const old = p.precoAntigo ? `<s>${money(+p.precoAntigo)}</s>` : '';
    return `<span class="price">${old}${money(+p.preco)}</span>`;
  };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Filtros ---------- */
  const filters = $('shopFilters');
  const grid = $('shopGrid');
  const empty = $('shopEmpty');
  let current = 'todos';

  const usedCats = ['todos', ...Object.keys(CATS).filter(c => c !== 'todos' && products.some(p => p.categoria === c))];
  filters.innerHTML = usedCats.map(c =>
    `<button class="filter${c === current ? ' is-active' : ''}" data-cat="${c}" role="tab">${CATS[c] || c}<sup>${c === 'todos' ? products.length : products.filter(p => p.categoria === c).length}</sup></button>`
  ).join('');

  const render = () => {
    const list = current === 'todos' ? products : products.filter(p => p.categoria === current);
    empty.hidden = list.length > 0;
    grid.innerHTML = list.map((p, i) => `
      <article class="product${p.esgotado ? ' is-sold' : ''}" style="--i:${i}" data-id="${esc(p.id)}">
        <button class="product__img" data-open="${esc(p.id)}" aria-label="Ver ${esc(p.nome)}">
          <img src="${esc(p.foto)}" alt="${esc(p.nome)}" loading="lazy" />
          ${p.selo && !p.esgotado ? `<span class="product__badge">${esc(p.selo)}</span>` : ''}
          ${p.esgotado ? '<span class="product__badge product__badge--sold">Esgotado</span>' : ''}
          <span class="product__view">Ver detalhes</span>
        </button>
        <div class="product__body">
          <p class="product__cat">${esc(CATS[p.categoria] || p.categoria)}</p>
          <h3 class="product__name">${esc(p.nome)}</h3>
          <div class="product__row">
            ${priceHTML(p)}
            <button class="product__add" data-quick="${esc(p.id)}" ${p.esgotado ? 'disabled' : ''} aria-label="Adicionar ${esc(p.nome)} à sacola">
              <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.3" fill="none"/></svg>
            </button>
          </div>
        </div>
      </article>`).join('');
    requestAnimationFrame(() => grid.querySelectorAll('.product').forEach(el => el.classList.add('is-in')));
  };

  const setFilter = cat => {
    current = usedCats.includes(cat) ? cat : 'todos';
    filters.querySelectorAll('.filter').forEach(b => b.classList.toggle('is-active', b.dataset.cat === current));
    render();
  };
  filters.addEventListener('click', e => {
    const b = e.target.closest('.filter');
    if (b) setFilter(b.dataset.cat);
  });
  document.querySelectorAll('[data-filter-link]').forEach(a =>
    a.addEventListener('click', () => setFilter(a.dataset.filterLink))
  );
  render();

  /* ---------- Sacola (salva no navegador) ---------- */
  const KEY = 'luzz-sacola';
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; }
  cart = cart.filter(it => products.some(p => p.id === it.id));
  const save = () => localStorage.setItem(KEY, JSON.stringify(cart));
  const byId = id => products.find(p => p.id === id);

  const add = (id, material, qty = 1) => {
    const p = byId(id);
    if (!p || p.esgotado) return;
    const mat = material || (p.materiais && p.materiais[0]) || '';
    const found = cart.find(it => it.id === id && it.material === mat);
    if (found) found.qty += qty; else cart.push({ id, material: mat, qty });
    save();
    renderCart();
    bump();
    toast(`<b>${esc(p.nome)}</b> foi para a sacola`, true);
  };

  const cartBtn = $('cartBtn');
  const count = $('cartCount');
  const bump = () => {
    cartBtn.classList.remove('is-bump');
    void cartBtn.offsetWidth;
    cartBtn.classList.add('is-bump');
  };

  const renderCart = () => {
    const n = cart.reduce((s, it) => s + it.qty, 0);
    count.textContent = n;
    cartBtn.classList.toggle('has-items', n > 0);
    $('cartEmpty').hidden = n > 0;
    $('cartFoot').hidden = n === 0;
    $('cartItems').innerHTML = cart.map((it, i) => {
      const p = byId(it.id);
      return `
        <div class="line">
          <img src="${esc(p.foto)}" alt="" />
          <div class="line__info">
            <p class="line__name">${esc(p.nome)}</p>
            ${it.material ? `<p class="line__mat">${esc(it.material)}</p>` : ''}
            <div class="qty qty--sm">
              <button data-dec="${i}" aria-label="Diminuir">−</button><span>${it.qty}</span><button data-inc="${i}" aria-label="Aumentar">+</button>
            </div>
          </div>
          <div class="line__side">
            ${p.preco != null && p.preco !== '' ? `<span class="price">${money(p.preco * it.qty)}</span>` : '<span class="price price--ask">Sob consulta</span>'}
            <button class="line__remove" data-rm="${i}">remover</button>
          </div>
        </div>`;
    }).join('');

    const allPriced = cart.every(it => { const p = byId(it.id); return p.preco != null && p.preco !== ''; });
    const total = cart.reduce((s, it) => s + (+byId(it.id).preco || 0) * it.qty, 0);
    $('cartTotal').textContent = allPriced ? money(total) : (total > 0 ? `${money(total)} + consulta` : 'Sob consulta');
    $('cartHint').textContent = 'Você envia o pedido pelo WhatsApp e a gente confirma valores, frete ou entrega VIP.';
  };

  $('cartItems').addEventListener('click', e => {
    const t = e.target;
    if (t.dataset.inc != null) cart[+t.dataset.inc].qty++;
    else if (t.dataset.dec != null) { const it = cart[+t.dataset.dec]; it.qty--; if (it.qty < 1) cart.splice(+t.dataset.dec, 1); }
    else if (t.dataset.rm != null) cart.splice(+t.dataset.rm, 1);
    else return;
    save(); renderCart();
  });

  const drawer = $('cartDrawer');
  const openCart = () => { $('toast').classList.remove('is-on'); drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('no-scroll'); };
  const closeCart = () => { drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('no-scroll'); };
  cartBtn.addEventListener('click', openCart);
  drawer.querySelectorAll('[data-close-cart]').forEach(el => el.addEventListener('click', closeCart));

  /* ---------- Finalizar pelo WhatsApp ---------- */
  const orderText = () => {
    const lines = cart.map(it => {
      const p = byId(it.id);
      const price = p.preco != null && p.preco !== '' ? ` — ${money(p.preco * it.qty)}` : '';
      return `• ${it.qty}x ${p.nome}${it.material ? ` (${it.material})` : ''}${price}`;
    });
    return `Olá, Luzz! ✨ Quero fazer um pedido:\n\n${lines.join('\n')}\n\nTotal: ${$('cartTotal').textContent}\n\nPode me ajudar a finalizar?`;
  };

  $('checkoutBtn').addEventListener('click', async () => {
    const text = orderText();
    const num = String(config.whatsapp || '').replace(/\D/g, '');
    if (num) {
      window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      return;
    }
    try { await navigator.clipboard.writeText(text); } catch (e) { /* sem permissão */ }
    toast('Pedido copiado! É só colar na conversa do WhatsApp.');
    setTimeout(() => window.open(config.whatsappLink || 'https://wa.me/message/NUPQV2P2MQB6P1', '_blank', 'noopener'), 900);
  });

  /* ---------- Detalhe da peça ---------- */
  const modal = $('productModal');
  let mp = null, mMat = '', mQty = 1;
  const openProduct = id => {
    mp = byId(id);
    if (!mp) return;
    mQty = 1;
    mMat = (mp.materiais && mp.materiais[0]) || '';
    $('pmImg').src = mp.foto;
    $('pmImg').alt = mp.nome;
    $('pmCat').textContent = CATS[mp.categoria] || mp.categoria;
    $('pmName').textContent = mp.nome;
    $('pmPrice').innerHTML = priceHTML(mp);
    $('pmDesc').textContent = mp.descricao || '';
    $('pmQty').textContent = mQty;
    const mats = mp.materiais || [];
    $('pmMatWrap').hidden = mats.length === 0;
    $('pmMats').innerHTML = mats.map(m => `<button type="button" class="chip${m === mMat ? ' is-active' : ''}" data-mat="${esc(m)}">${esc(m)}</button>`).join('');
    const add = $('pmAdd');
    add.disabled = !!mp.esgotado;
    add.firstChild.textContent = mp.esgotado ? 'Esgotado ' : 'Adicionar à sacola ';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('no-scroll');
  };
  const closeProduct = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('no-scroll');
  };
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeProduct));
  $('pmMats').addEventListener('click', e => {
    const c = e.target.closest('.chip');
    if (!c) return;
    mMat = c.dataset.mat;
    $('pmMats').querySelectorAll('.chip').forEach(x => x.classList.toggle('is-active', x === c));
  });
  $('pmMinus').addEventListener('click', () => { mQty = Math.max(1, mQty - 1); $('pmQty').textContent = mQty; });
  $('pmPlus').addEventListener('click', () => { mQty++; $('pmQty').textContent = mQty; });
  $('pmAdd').addEventListener('click', () => { add(mp.id, mMat, mQty); closeProduct(); });

  grid.addEventListener('click', e => {
    const o = e.target.closest('[data-open]');
    const q = e.target.closest('[data-quick]');
    if (q) { add(q.dataset.quick); return; }
    if (o) openProduct(o.dataset.open);
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    closeProduct(); closeCart();
  });

  /* ---------- Aviso ---------- */
  const toastEl = $('toast');
  let tt;
  const toast = (html, withLink) => {
    toastEl.innerHTML = `<svg><use href="#sparkle"/></svg><span>${html}</span>${withLink ? '<button type="button" class="toast__link">ver sacola</button>' : ''}`;
    toastEl.classList.add('is-on');
    clearTimeout(tt);
    tt = setTimeout(() => toastEl.classList.remove('is-on'), 3200);
  };
  toastEl.addEventListener('click', e => { if (e.target.closest('.toast__link')) { toastEl.classList.remove('is-on'); openCart(); } });

  renderCart();
})();
