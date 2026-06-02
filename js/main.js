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
  if (cur < 6) {
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

/* ═══ ТАБЫ ДОСТАВКИ ═══ */
function delTab(btn, idx) {
  document.querySelectorAll('.del-tab').forEach((t, i) => t.classList.toggle('on', i === idx));
  document.querySelectorAll('.del-col').forEach((c, i) => c.classList.toggle('on', i === idx));
}

/* ═══ СЕГМЕНТЫ ═══ */
document.querySelectorAll('.stab').forEach(t => {
  t.addEventListener('click', function () {
    document.querySelectorAll('.stab').forEach(s => s.classList.remove('on'));
    this.classList.add('on');
  });
});

/* ═══ КАТАЛОГ: ФИЛЬТР + ПАГИНАЦИЯ ═══ */
let curPg = 1;
let curCat = 'all';
let catTotalPages = 1;
const PER_PAGE = 6;

function catRender() {
  const allProduct = Array.from(document.querySelectorAll('#catGrid .pcard[data-cat]'))
    .filter(c => c.id !== 'c6');
  const filtered = allProduct.filter(c => curCat === 'all' || c.dataset.cat === curCat);
  catTotalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  if (curPg > catTotalPages) curPg = catTotalPages;

  allProduct.forEach(c => c.style.display = 'none');
  const pageCards = filtered.slice((curPg - 1) * PER_PAGE, curPg * PER_PAGE);
  pageCards.forEach(c => c.style.display = '');

  const c6 = document.getElementById('c6');
  if (c6) c6.style.display = pageCards.length < PER_PAGE ? '' : 'none';

  const pag = document.querySelector('.cat-pag');
  if (pag) pag.style.display = catTotalPages <= 1 ? 'none' : '';

  document.querySelectorAll('.pg-n').forEach((b, i) => {
    b.style.display = i < catTotalPages ? '' : 'none';
    b.classList.toggle('on', i + 1 === curPg);
  });

  const more = document.querySelector('.pg-more');
  if (more) more.style.display = curPg < catTotalPages ? '' : 'none';

  document.querySelectorAll('.cf[onclick]').forEach(btn => {
    const m = btn.getAttribute('onclick').match(/'([^']+)'\s*\)/);
    if (!m) return;
    const cat = m[1];
    const span = btn.querySelector('.cf-count');
    if (!span) return;
    span.textContent = cat === 'all'
      ? allProduct.length
      : allProduct.filter(c => c.dataset.cat === cat).length;
  });
}

function catF(btn, cat) {
  curCat = cat;
  curPg = 1;
  document.querySelectorAll('.cf').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  catRender();
}

function catPg(p) {
  if (p === 'next') p = Math.min(curPg + 1, catTotalPages);
  curPg = p;
  catRender();
}
catRender();

/* ═══ FAQ ═══ */
function togF(el) {
  const a = el.nextElementSibling;
  const open = a.classList.contains('open');
  document.querySelectorAll('.fa').forEach(x => x.classList.remove('open'));
  document.querySelectorAll('.fq').forEach(x => x.classList.remove('open'));
  if (!open) { a.classList.add('open'); el.classList.add('open'); }
}

/* ═══ ТЕЛЕФОН ═══ */
function phoneFormat(el) {
  let d = el.value.replace(/\D/g, '');
  if (d.startsWith('8')) d = '7' + d.slice(1);
  if (d.length && !d.startsWith('7')) d = '7' + d;
  d = d.slice(0, 11);
  const n = d.slice(1);
  let out = '';
  if (d.length >= 1) out = '+7';
  if (n.length > 0)  out += ' (' + n.slice(0, 3);
  if (n.length >= 3) out += ')';
  if (n.length > 3)  out += ' ' + n.slice(3, 6);
  if (n.length > 6)  out += '-' + n.slice(6, 8);
  if (n.length > 8)  out += '-' + n.slice(8, 10);
  el.value = out;
  el.classList.remove('err');
}
function phoneValid(val) { return val.replace(/\D/g, '').length === 11; }

/* ═══ ПОПАПЫ ═══ */
const pops = {
  kp:      { lbl: 'Коммерческое предложение', ttl: 'Получить КП за 15 минут',   sub: 'Укажите контакт — инженер пришлёт КП с ценами и сроками', fields: [['name','Ваше имя'],['contact','Ваш телефон'],['city','Ваш город']], btn: 'Отправить запрос' },
  consult: { lbl: 'Консультация',             ttl: 'Задать вопрос инженеру',     sub: 'Опишите задачу — ответим в течение 30 минут',             fields: [['name','Ваше имя'],['contact','Ваш телефон']], ta: 'Опишите задачу: сфера, мощность, давление...', btn: 'Задать вопрос' },
  price:   { lbl: 'Цена',                     ttl: 'Зафиксировать цену',         sub: 'Цены меняются — зафиксируем на 3 дня',                    fields: [['name','Ваше имя'],['contact','Ваш телефон']], btn: 'Зафиксировать' },
  call:    { lbl: 'Обратный звонок',          ttl: 'Перезвоним за 2 минуты',     sub: 'Укажите номер — менеджер перезвонит немедленно',          fields: [['contact','Ваш телефон']], btn: 'Перезвоните мне' },
  mag:     { lbl: 'Материал',                 ttl: 'Получить бесплатно',         sub: 'Пришлём материал на указанный телефон',                   fields: [['name','Ваше имя'],['contact','Ваш телефон']], btn: 'Получить' },
};
function openPop(type) {
  const d = pops[type]; if (!d) return;
  let h = `<div class="pop-lbl">${d.lbl}</div><div class="pop-ttl">${d.ttl}</div><div class="pop-sub">${d.sub}</div>`;
  h += `<div class="pop-form" id="popForm" data-type="${type}">`;
  d.fields.forEach(([key, placeholder]) => {
    const isPhone = key === 'contact';
    h += `<input class="fi" type="${isPhone ? 'tel' : 'text'}" data-field="${key}" placeholder="${placeholder}"${isPhone ? ' oninput="phoneFormat(this)"' : ''}>`;
  });
  if (d.ta) h += `<textarea class="fi" data-field="message" rows="3" placeholder="${d.ta}" style="resize:none"></textarea>`;
  h += `<input type="text" name="website" style="display:none;position:absolute;left:-9999px" tabindex="-1" autocomplete="off">`;
  h += `<button class="pop-btn" onclick="submitPop(this)">${d.btn} <svg width="14" height="14"><use href="#i-arrow"/></svg></button>`;
  h += `<p class="pop-note">Нажимая кнопку, вы соглашаетесь с политикой обработки данных</p></div>`;
  document.getElementById('popContent').innerHTML = h;
  document.getElementById('popup').classList.add('open');
}
function submitPop(btn) {
  const form = document.getElementById('popForm');
  const phoneEl = form.querySelector('[data-field=contact]');
  if (phoneEl && !phoneValid(phoneEl.value)) {
    phoneEl.classList.add('err');
    phoneEl.focus();
    return;
  }
  const data = { type: form.dataset.type, website: form.querySelector('[name=website]').value };
  form.querySelectorAll('.fi[data-field]').forEach(el => { data[el.dataset.field] = el.value.trim(); });
  btn.disabled = true;
  const origHTML = btn.innerHTML;
  btn.textContent = 'Отправляем…';
  fetch('/submit.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(r => r.json())
    .then(res => {
      if (res.ok) {
        document.getElementById('popContent').innerHTML =
          '<div class="pop-success">' +
          '<svg width="48" height="48"><use href="#i-check"/></svg>' +
          '<div class="pop-ttl">Заявка отправлена</div>' +
          '<div class="pop-sub">Мы свяжемся с вами в течение 30 минут</div>' +
          '</div>';
      } else {
        btn.disabled = false;
        btn.innerHTML = origHTML;
      }
    })
    .catch(() => { btn.disabled = false; btn.innerHTML = origHTML; });
}
function closePop() { document.getElementById('popup').classList.remove('open'); }

/* ═══ КВИЗ: ОТПРАВКА ═══ */
function submitQuiz(btn) {
  const phoneEl = document.getElementById('qPhone');
  if (!phoneValid(phoneEl.value)) {
    phoneEl.classList.add('err');
    phoneEl.focus();
    return;
  }
  const nameEl = document.getElementById('qName');
  const answers = [];
  document.querySelectorAll('.qstep').forEach(step => {
    const sel = step.querySelector('.qopt.sel');
    if (sel) answers.push(sel.textContent.trim());
  });
  btn.disabled = true;
  btn.textContent = 'Отправляем…';
  fetch('/submit.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'quiz', name: nameEl.value.trim(), contact: phoneEl.value.trim(), message: answers.join(' / '), website: '' }),
  })
    .then(r => r.json())
    .then(res => {
      if (res.ok) {
        document.getElementById('qfinal').innerHTML =
          '<div style="text-align:center;padding:24px 0">' +
          '<svg width="48" height="48" style="color:var(--coral)"><use href="#i-check"/></svg>' +
          '<h3 style="margin:16px 0 8px">Заявка отправлена!</h3>' +
          '<p style="color:var(--ash)">Инженер пришлёт подборку в течение 15 минут</p>' +
          '</div>';
      } else {
        btn.disabled = false;
        btn.textContent = 'Получить подборку';
      }
    })
    .catch(() => { btn.disabled = false; btn.textContent = 'Получить подборку'; });
}

/* ═══ ФУТЕР: ОТПРАВКА ═══ */
function submitFooter(btn) {
  const phoneEl = document.getElementById('fPhone');
  if (!phoneValid(phoneEl.value)) {
    phoneEl.classList.add('err');
    phoneEl.focus();
    return;
  }
  btn.disabled = true;
  const origHTML = btn.innerHTML;
  btn.textContent = 'Отправляем…';
  fetch('/submit.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'kp', name: document.getElementById('fName').value.trim(), contact: phoneEl.value.trim(), city: document.getElementById('fCity').value.trim(), website: '' }),
  })
    .then(r => r.json())
    .then(res => {
      if (res.ok) {
        document.querySelector('.final-r').innerHTML =
          '<div style="text-align:center;padding:16px 0;color:#fff">' +
          '<svg width="48" height="48"><use href="#i-check"/></svg>' +
          '<div style="font-family:var(--fh);font-size:20px;font-weight:600;margin:16px 0 8px">Заявка отправлена!</div>' +
          '<div style="color:rgba(255,255,255,.8)">Инженер свяжется с вами в течение 15 минут</div>' +
          '</div>';
      } else {
        btn.disabled = false;
        btn.innerHTML = origHTML;
      }
    })
    .catch(() => { btn.disabled = false; btn.innerHTML = origHTML; });
}

/* ═══ НАВИГАЦИЯ (мобайл) ═══ */
function toggleNav() {
  const nav = document.getElementById('main-nav');
  const tog = document.getElementById('navTog');
  nav.classList.toggle('open');
  tog.classList.toggle('on');
}
function closeNav() {
  document.getElementById('main-nav').classList.remove('open');
  document.getElementById('navTog').classList.remove('on');
}

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
