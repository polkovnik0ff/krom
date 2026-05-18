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
  kp:      { lbl: 'Коммерческое предложение', ttl: 'Получить КП за 15 минут',   sub: 'Укажите контакт — инженер пришлёт КП с ценами и сроками', fields: [['name','Ваше имя'],['contact','Max / Telegram'],['city','Ваш город']], btn: 'Отправить запрос' },
  consult: { lbl: 'Консультация',             ttl: 'Задать вопрос инженеру',     sub: 'Опишите задачу — ответим в течение 30 минут',             fields: [['name','Ваше имя'],['contact','Телефон или Max']], ta: 'Опишите задачу: сфера, мощность, давление...', btn: 'Задать вопрос' },
  price:   { lbl: 'Цена',                     ttl: 'Зафиксировать цену',         sub: 'Цены меняются — зафиксируем на 3 дня',                    fields: [['name','Ваше имя'],['contact','Max']], btn: 'Зафиксировать' },
  call:    { lbl: 'Обратный звонок',          ttl: 'Перезвоним за 2 минуты',     sub: 'Укажите номер — менеджер перезвонит немедленно',          fields: [['contact','Ваш телефон']], btn: 'Перезвоните мне' },
  mag:     { lbl: 'Материал',                 ttl: 'Получить бесплатно',         sub: 'Пришлём на Max или email',                                fields: [['name','Ваше имя'],['contact','Max или email']], btn: 'Получить' },
};
function openPop(type) {
  const d = pops[type]; if (!d) return;
  let h = `<div class="pop-lbl">${d.lbl}</div><div class="pop-ttl">${d.ttl}</div><div class="pop-sub">${d.sub}</div>`;
  h += `<div class="pop-form" id="popForm" data-type="${type}">`;
  d.fields.forEach(([key, placeholder]) => {
    h += `<input class="fi" type="text" data-field="${key}" placeholder="${placeholder}">`;
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
