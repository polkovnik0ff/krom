/* КВИЗ */
function selQ(el, step) {
  el.closest('.qopts').querySelectorAll('.qopt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel');
  setTimeout(() => nextQ(step), 300);
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

/* СЕГМЕНТЫ */
document.querySelectorAll('.stab').forEach(t => {
  t.addEventListener('click', function () {
    document.querySelectorAll('.stab').forEach(s => s.classList.remove('on'));
    this.classList.add('on');
  });
});

/* КАТАЛОГ: ФИЛЬТР */
function catF(btn, cat) {
  document.querySelectorAll('.cf').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('#catGrid .pcard[data-cat]').forEach(c => {
    c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
  });
}

/* КАТАЛОГ: ПАГИНАЦИЯ */
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

/* FAQ */
function togF(el) {
  const a = el.nextElementSibling;
  const open = a.classList.contains('open');
  document.querySelectorAll('.fa').forEach(x => x.classList.remove('open'));
  document.querySelectorAll('.fq').forEach(x => x.classList.remove('open'));
  if (!open) { a.classList.add('open'); el.classList.add('open'); }
}

/* ПОПАПЫ */
const pops = {
  kp:      { lbl: 'Коммерческое предложение', ttl: 'Получить КП за 15 минут',   sub: 'Укажите контакт — инженер пришлёт КП с ценами и сроками', fields: ['Ваше имя', 'WhatsApp / Telegram', 'Ваш город'], btn: 'Отправить запрос →' },
  consult: { lbl: 'Консультация',             ttl: 'Задать вопрос инженеру',     sub: 'Опишите задачу — ответим в течение 30 минут',             fields: ['Ваше имя', 'Телефон или WhatsApp'], ta: 'Опишите задачу: сфера, мощность, давление...', btn: 'Задать вопрос →' },
  price:   { lbl: 'Цена',                     ttl: 'Зафиксировать цену',         sub: 'Цены меняются — зафиксируем на 3 дня',                    fields: ['Ваше имя', 'WhatsApp'], btn: 'Зафиксировать →' },
  call:    { lbl: 'Обратный звонок',          ttl: 'Перезвоним за 2 минуты',     sub: 'Укажите номер — менеджер перезвонит немедленно',          fields: ['Ваш телефон'], btn: 'Перезвоните мне →' },
  mag:     { lbl: 'Материал',                 ttl: 'Получить бесплатно',         sub: 'Пришлём на WhatsApp или email',                           fields: ['Ваше имя', 'WhatsApp или email'], btn: 'Получить →' },
};
function openPop(type) {
  const d = pops[type]; if (!d) return;
  let h = `<div class="pop-lbl">${d.lbl}</div><div class="pop-ttl">${d.ttl}</div><div class="pop-sub">${d.sub}</div><div class="pop-form">`;
  d.fields.forEach(f => { h += `<input class="fi" type="text" placeholder="${f}">`; });
  if (d.ta) h += `<textarea class="fi" rows="3" placeholder="${d.ta}" style="resize:none"></textarea>`;
  h += `<button class="pop-btn">${d.btn}</button><p class="pop-note">Нажимая кнопку, вы соглашаетесь с политикой обработки данных</p></div>`;
  document.getElementById('popContent').innerHTML = h;
  document.getElementById('popup').classList.add('open');
}
function closePop() { document.getElementById('popup').classList.remove('open'); }
