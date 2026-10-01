/* ===========================================================
   Cac ham dung chung cho giao dien
   =========================================================== */

/* h('div.card', {attr}, child, child...) */
function h(spec, attrs) {
  const parts = String(spec).split(/(?=[.#])/);
  const el = document.createElement(parts[0] || 'div');
  parts.slice(1).forEach(function (p) {
    if (p[0] === '.') el.classList.add(p.slice(1));
    else if (p[0] === '#') el.id = p.slice(1);
  });
  let start = 1;
  if (attrs && attrs.constructor === Object) {
    start = 2;
    Object.keys(attrs).forEach(function (k) {
      const v = attrs[k];
      if (k === 'style' && typeof v === 'object') setStyle(el, v);
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (v !== null && v !== undefined && v !== false) el.setAttribute(k, v);
    });
  }
  for (let i = start; i < arguments.length; i++) append(el, arguments[i]);
  return el;
}

/* Custom property (--x) phai dung setProperty, Object.assign khong nhan */
function setStyle(el, obj) {
  Object.keys(obj).forEach(function (k) {
    if (k.indexOf('--') === 0) el.style.setProperty(k, obj[k]);
    else el.style[k] = obj[k];
  });
}

function append(parent, node) {
  if (node === null || node === undefined || node === false) return;
  if (Array.isArray(node)) return node.forEach(function (n) { append(parent, n); });
  parent.appendChild(node.nodeType ? node : document.createTextNode(String(node)));
}

function soundVar(key) { return 'var(--c-' + key + ')'; }

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

/* Tach tu thanh phan dau va phan duoi duoc to mau */
function splitTail(word, n) {
  if (!n) return [word, ''];
  return [word.slice(0, word.length - n), word.slice(word.length - n)];
}

/* Nut tu vung co the bam de nghe */
function wordButton(word, soundKey, vi, tailLen) {
  const tail = tailLen === undefined ? defaultTail(word, soundKey) : tailLen;
  const parts = splitTail(word, tail);
  const btn = h('button.wordbtn', {
    style: { '--c': soundVar(soundKey) },
    type: 'button',
    'aria-label': 'Nghe từ ' + word
  },
    h('span', {}, parts[0], parts[1] ? h('span.tail', { text: parts[1] }) : null),
    vi ? h('span.vi', { text: vi }) : null
  );
  btn.addEventListener('click', function () {
    document.querySelectorAll('.wordbtn.is-playing').forEach(function (e) { e.classList.remove('is-playing'); });
    btn.classList.add('is-playing');
    Speech.say(word, { onend: function () { btn.classList.remove('is-playing'); } });
    setTimeout(function () { btn.classList.remove('is-playing'); }, 2200);
  });
  return btn;
}

/* Doan chu cuoi tuong ung voi am cuoi, dung cho hien thi */
function defaultTail(word, key) {
  const w = word.replace(/[.,!?]/g, '').toLowerCase();
  if (key === 's' || key === 'z') {
    if (/ce$/.test(w)) return 2;
    if (/se$/.test(w)) return 2;
    return 1;
  }
  if (key === 'k') {
    if (/ck$/.test(w)) return 2;
    if (/ke$/.test(w)) return 2;
    return 1;
  }
  if (key === 't' || key === 'd') {
    if (/te$|de$/.test(w)) return 2;
    return 1;
  }
  return 1;
}

/* Hieu ung hat sang khi tra loi dung */
function sparkle(target) {
  const r = target.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const colors = ['var(--c-t)', 'var(--c-d)', 'var(--c-k)', 'var(--c-s)', 'var(--c-z)'];
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    s.style.background = colors[i % colors.length];
    s.style.left = cx + 'px';
    s.style.top = cy + 'px';
    document.body.appendChild(s);
    const ang = (Math.PI * 2 * i) / 16 + Math.random() * 0.5;
    const dist = 70 + Math.random() * 90;
    s.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: 'translate(' + (Math.cos(ang) * dist - 50) + '%,' + (Math.sin(ang) * dist + 40) + '%) scale(0)', opacity: 0 }
    ], { duration: 700 + Math.random() * 300, easing: 'cubic-bezier(.2,.8,.3,1)' })
      .onfinish = function () { s.remove(); };
  }
}

/* Khoi cham diem dung chung cho cac minigame */
function scoreBar(labels) {
  const score = h('b', { text: '0' });
  const total = h('b', { text: '0' });
  const streak = h('b', { text: '0' });
  const streakBox = h('span.stat', {}, '🔥 Chuỗi đúng ', streak);
  const bar = h('div.gamebar', {},
    h('span.stat', {}, '✅ Đúng ', score, ' / ', total),
    streakBox,
    labels || null
  );
  return {
    el: bar,
    mark: function (ok) {
      total.textContent = String(Number(total.textContent) + 1);
      if (ok) {
        score.textContent = String(Number(score.textContent) + 1);
        streak.textContent = String(Number(streak.textContent) + 1);
        if (Number(streak.textContent) >= 3) {
          streakBox.classList.remove('is-hot');
          void streakBox.offsetWidth;
          streakBox.classList.add('is-hot');
        }
      } else {
        streak.textContent = '0';
        streakBox.classList.remove('is-hot');
      }
    },
    reset: function () { score.textContent = '0'; total.textContent = '0'; streak.textContent = '0'; streakBox.classList.remove('is-hot'); }
  };
}
