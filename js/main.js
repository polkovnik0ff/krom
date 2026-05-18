/* ═══ КВИЗ ═══ */
function selQ(el, step) {
  el.closest('.qopts').querySelectorAll('.qopt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel');
  setTimeout(() => nextQ(step), 320);
}
function nextQ(cur) {
  document.getElementById('qs' + cur).classList.remove('on');
  document.getElementById('qp' + cur).classList.remove('cur');
  document.getElementById('qp' + cur).classList.add('done');
  if (cur < 4) {
    document.getElementById('qs' + (cur + 1)).classList.add('on');
    document.getElementById('qp' + (cur + 1)).classList.add('cur');
  } else {
    document.getElementById('qfinal').classList.add('on');
  }
}
function prevQ(cur) {
  document.getElementById('qs' + cur).classList.remove('on');
  document.getElementById('qp' + (cur - 1)).classList.remove('done');
  document.getElementById('qp' + (cur - 1)).classList.add('cur');
  document.getElementById('qs' + (cur - 1)).classList.add('on');
}

/* ═══ СЕГМЕНТЫ ═══ */
document.querySelectorAll('.stab').forEach(t => {
  t.addEventListener('click', function () {
    document.querySelectorAll('.stab').forEach(s => s.classList.remove('on'));
    this.classList.add('on');
  });
});

/* ═══ КАТАЛОГ: ФИЛЬТР ═══ */
function catF(btn, cat) {
  document.querySelectorAll('.cf').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('#catGrid .pcard[data-cat]').forEach(c => {
    c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
  });
}

/* ═══ КАТАЛОГ: ПАГИНАЦИЯ ═══ */
let curPg = 1;
function catPg(p) {
  if (p === 'next') p = Math.min(curPg + 1, 3);
  curPg = p;
  document.querySelectorAll('.pg-n').forEach((b, i) => b.classList.toggle('on', i + 1 === p));
  ['c4', 'c5', 'c6'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (p === 2) ? '' : 'none';
  });
}
catPg(1);

/* ═══ FAQ ═══ */
function togF(el) {
  const a = el.nextElementSibling;
  const open = a.classList.contains('open');
  document.querySelectorAll('.fa').forEach(x => x.classList.remove('open'));
  document.querySelectorAll('.fq').forEach(x => x.classList.remove('open'));
  if (!open) { a.classList.add('open'); el.classList.add('open'); }
}

/* ═══ ПОПАПЫ ═══ */
const pops = {
  kp:      { lbl: 'Коммерческое предложение', ttl: 'Получить КП за 15 минут',   sub: 'Укажите контакт — инженер пришлёт КП с ценами и сроками', fields: ['Ваше имя', 'Max / Telegram', 'Ваш город'], btn: 'Отправить запрос' },
  consult: { lbl: 'Консультация',             ttl: 'Задать вопрос инженеру',     sub: 'Опишите задачу — ответим в течение 30 минут',             fields: ['Ваше имя', 'Телефон или Max'], ta: 'Опишите задачу: сфера, мощность, давление...', btn: 'Задать вопрос' },
  price:   { lbl: 'Цена',                     ttl: 'Зафиксировать цену',         sub: 'Цены меняются — зафиксируем на 3 дня',                    fields: ['Ваше имя', 'Max'], btn: 'Зафиксировать' },
  call:    { lbl: 'Обратный звонок',          ttl: 'Перезвоним за 2 минуты',     sub: 'Укажите номер — менеджер перезвонит немедленно',          fields: ['Ваш телефон'], btn: 'Перезвоните мне' },
  mag:     { lbl: 'Материал',                 ttl: 'Получить бесплатно',         sub: 'Пришлём на Max или email',                           fields: ['Ваше имя', 'Max или email'], btn: 'Получить' },
};
function openPop(type) {
  const d = pops[type]; if (!d) return;
  let h = `<div class="pop-lbl">${d.lbl}</div><div class="pop-ttl">${d.ttl}</div><div class="pop-sub">${d.sub}</div><div class="pop-form">`;
  d.fields.forEach(f => { h += `<input class="fi" type="text" placeholder="${f}">`; });
  if (d.ta) h += `<textarea class="fi" rows="3" placeholder="${d.ta}" style="resize:none"></textarea>`;
  h += `<button class="pop-btn">${d.btn} <svg width="14" height="14"><use href="#i-arrow"/></svg></button><p class="pop-note">Нажимая кнопку, вы соглашаетесь с политикой обработки данных</p></div>`;
  document.getElementById('popContent').innerHTML = h;
  document.getElementById('popup').classList.add('open');
}
function closePop() { document.getElementById('popup').classList.remove('open'); }

/* ═══ HEADER SCROLL ═══ */
const hdr = document.getElementById('hdr');
window.addEventListener('scroll', () => {
  hdr.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

/* ═══ SCROLL REVEAL ═══ */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ═══ COUNT-UP ═══ */
const counters = document.querySelectorAll('.count');
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const to = parseInt(el.dataset.to, 10);
    const dur = 1100;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    cio.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach(c => cio.observe(c));

/* ═══ HERO CARD PARALLAX (mouse) ═══ */
const hcard = document.getElementById('hcard');
if (hcard && window.matchMedia('(hover:hover)').matches) {
  const hWrap = hcard.parentElement;
  hWrap.addEventListener('mousemove', (e) => {
    const r = hWrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    hcard.style.transform = `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-2px)`;
  });
  hWrap.addEventListener('mouseleave', () => {
    hcard.style.transform = '';
  });
}

/* ═══ MAGNETIC RED BUTTONS ═══ */
document.querySelectorAll('.btn-r').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.12}px, ${y * 0.18 - 2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ═══ ESC закрывает попап ═══ */
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePop();
});
