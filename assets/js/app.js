/* ===========================================================
   Dung cac slide va dieu khien dieu huong
   =========================================================== */

function sectionHead(eyebrow, title, lead) {
  return h('div', {},
    eyebrow ? h('span.eyebrow', { text: eyebrow }) : null,
    h('h2', { text: title }),
    lead ? h('p.lead', { text: lead }) : null
  );
}

/* ---------- Slide 1: bia ---------- */
function slideCover() {
  const chips = h('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '26px' } },
    SOUND_ORDER.map(function (k, i) {
      const c = h('button.sound-chip.reveal', {
        type: 'button',
        title: 'Xem chi tiết âm ' + SOUNDS[k].ipa,
        style: { '--c': soundVar(k), animationDelay: (i * 90) + 'ms', cursor: 'pointer' },
        text: SOUNDS[k].ipa,
        onclick: function () { Deck.go(4 + i); }
      });
      return c;
    })
  );
  return h('div', { style: { paddingTop: '18px' } },
    h('span.eyebrow', {}, 'Speaking căn bản · Bài 1'),
    h('h1', {}, 'Âm cuối: thứ nhỏ nhất làm người nghe hiểu bạn'),
    h('p.lead', {}, 'Bài này chỉ tập trung vào năm âm cuối thường gặp nhất: /t/, /d/, /k/, /s/, /z/. Không có mẹo cao siêu, không có từ vựng hoa mỹ. Chỉ là phát âm cho tới nơi để người nghe không phải đoán.'),
    chips,
    h('div.grid.grid--3', { style: { marginTop: '30px' } },
      h('div.card', {}, h('h3', {}, '🎧 Nghe mẫu'), h('p.muted', {}, 'Mọi từ trong bài đều bấm được để nghe. Nghe trước, bắt chước sau.')),
      h('div.card', {}, h('h3', {}, '🎮 Bốn hoạt động'), h('p.muted', {}, 'Nghe chọn âm, phân loại từ, phân biệt cặp từ, và đọc đoạn văn có đánh dấu.')),
      h('div.card', {}, h('h3', {}, '🎙 Tự ghi âm'), h('p.muted', {}, 'Ghi lại giọng mình rồi nghe lại. Đây là cách sửa phát âm nhanh nhất.'))
    ),
    h('p.muted', { style: { marginTop: '24px' } }, 'Dùng phím ', h('span.kbd', {}, '←'), ' ', h('span.kbd', {}, '→'), ' để chuyển slide.')
  );
}

/* ---------- Slide 2: vi sao quan trong ---------- */
function slideWhy() {
  function demo(a, b, note, key) {
    return h('div.card', {},
      h('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' } },
        wordButton(a, key, null),
        h('span', { style: { alignSelf: 'center', color: 'var(--ink-3)', fontWeight: '700' } }, 'vs'),
        wordButton(b, key, null)
      ),
      h('p.muted', { text: note })
    );
  }
  return h('div', {},
    sectionHead('Vì sao bắt đầu từ đây', 'Người nghe không đoán, họ chỉ nghe thấy gì thì hiểu vậy',
      'Tiếng Việt hầu như không bật âm cuối, nên người Việt có thói quen nuốt phần đuôi của từ tiếng Anh. Phần đuôi đó lại chính là nơi tiếng Anh cất giữ ngữ pháp.'),
    h('div.grid.grid--2', {},
      demo('I need a book', 'I need books', 'Mất /s/ là mất luôn số nhiều. Giám khảo nghe thành lỗi ngữ pháp, dù bạn biết thừa quy tắc.', 's'),
      demo('I work here', 'I worked here', 'Mất /t/ là mất luôn thì quá khứ. Câu chuyện của bạn đột nhiên sai thời gian.', 't')
    ),
    h('div.card', { style: { marginTop: '14px' } },
      h('h3', {}, 'Điều quan trọng cần nhớ'),
      h('p', {}, 'Band điểm Pronunciation không đo xem bạn có giọng Anh hay giọng Mỹ. Nó đo mức độ người nghe hiểu bạn mà không phải cố gắng. Âm cuối rõ ràng giúp điều đó nhiều hơn bất kỳ từ vựng khó nào.'),
      h('p.muted', { style: { margin: 0 } }, 'Nói rõ ràng luôn thắng nói phức tạp.')
    )
  );
}

/* ---------- Slide 3: nguyen tac chung ---------- */
function slidePrinciple() {
  const items = [
    ['Chạm, không gồng', 'Âm cuối trong tiếng Anh rất nhẹ. Bạn chỉ cần chạm lưỡi hoặc đưa hơi ra một chút, không cần bật thật to. Gồng quá sẽ nghe như thêm một âm "ơ" vào cuối.'],
    ['Đừng thêm nguyên âm', '"Like" là /laɪk/, không phải "lai-kơ". Người Việt hay thêm "ơ" vào cuối vì tiếng Việt luôn kết thúc bằng nguyên âm hoặc âm ngậm miệng.'],
    ['Vô thanh và hữu thanh là cặp đôi', '/t/ và /d/ có vị trí lưỡi giống hệt nhau. /s/ và /z/ cũng vậy. Khác biệt duy nhất là dây thanh có rung hay không. Đặt tay lên cổ họng là kiểm tra được ngay.'],
    ['Nối âm là bạn, không phải kẻ thù', 'Khi âm cuối gặp nguyên âm ở từ sau, nó trôi sang: "look at it" nghe như "loo-ka-tit". Đây là cách tự nhiên để giữ âm cuối mà vẫn nói trôi chảy.']
  ];
  return h('div', {},
    sectionHead('Bốn nguyên tắc', 'Bốn điều này giải quyết phần lớn vấn đề',
      'Không cần học thuộc bảng phiên âm. Bốn nguyên tắc dưới đây là đủ cho toàn bộ bài hôm nay.'),
    h('div.grid.grid--2', {}, items.map(function (it, i) {
      const c = h('div.card.reveal', { style: { animationDelay: (i * 90) + 'ms' } },
        h('h3', { text: it[0] }), h('p.muted', { style: { margin: 0 }, text: it[1] }));
      return c;
    })),
    h('div.card', { style: { marginTop: '14px' } },
      h('h3', {}, 'Thử ngay: đặt tay lên cổ họng'),
      h('div.wordrow', {},
        wordButton('bat', 't', 'không rung'), wordButton('bad', 'd', 'có rung'),
        wordButton('price', 's', 'không rung'), wordButton('prize', 'z', 'có rung')
      )
    )
  );
}

/* ---------- Slide 4: ban do nam am ---------- */
function slideMap() {
  const cards = SOUND_ORDER.map(function (k, i) {
    const s = SOUNDS[k];
    const card = h('button.soundcard.reveal', {
      type: 'button',
      style: { '--c': soundVar(k), animationDelay: (i * 80) + 'ms' }
    },
      h('div.soundcard__ipa', { text: s.ipa }),
      h('div.soundcard__kind', { text: s.kind }),
      h('div.soundcard__ex', { text: s.words.slice(0, 3).map(function (w) { return w.w; }).join(' · ') })
    );
    card.addEventListener('click', function () { Deck.go(4 + i); });
    return card;
  });
  return h('div', {},
    sectionHead('Bản đồ bài học', 'Năm âm cuối, hai nhóm',
      'Ba âm bật (/t/, /d/, /k/) chặn hơi rồi nhả ra. Hai âm xát (/s/, /z/) để hơi chảy liên tục. Bấm vào một thẻ để xem chi tiết.'),
    h('div.grid.grid--3', {}, cards),
    h('div.card', { style: { marginTop: '16px' } },
      h('h3', {}, 'Vì sao đúng năm âm này đi chung một bài?'),
      h('p', { style: { margin: 0 } }, 'Vì chúng gánh gần như toàn bộ ngữ pháp ở cuối từ: đuôi -s của số nhiều và ngôi thứ ba đọc thành /s/ hoặc /z/, đuôi -ed của quá khứ đọc thành /t/ hoặc /d/. Riêng /k/ là âm cuối xuất hiện dày đặc trong từ vựng hằng ngày. Học năm âm này là xử lý được phần lớn lỗi âm cuối.')
    )
  );
}

/* ---------- Slide 5 den 9: tung am ---------- */
function slideSound(key) {
  const s = SOUNDS[key];
  const pair = { t: 'd', d: 't', s: 'z', z: 's', k: null }[key];
  return function () {
    return h('div', { style: { '--c': soundVar(key) } },
      h('span.eyebrow', { style: { color: soundVar(key), background: 'color-mix(in srgb, ' + soundVar(key) + ' 14%, transparent)' } }, s.kind),
      h('h2', { style: { color: soundVar(key) } }, 'Âm cuối ' + s.ipa),
      h('p.lead', { text: s.how }),
      h('div.grid.grid--2', {},
        h('div.card', { style: { '--c': soundVar(key) } },
          h('h3', {}, '✋ Cảm nhận thế nào'),
          h('p.muted', { style: { margin: 0 }, text: s.feel })
        ),
        h('div.card', { style: { '--c': soundVar(key) } },
          h('h3', {}, '⚠️ Lỗi thường gặp'),
          h('p.muted', { style: { margin: 0 }, text: s.mistake })
        )
      ),
      h('div.card', { style: { marginTop: '14px' } },
        h('h3', {}, 'Nghe và đọc theo'),
        h('p.muted', {}, 'Bấm từng từ. Đọc lại ngay sau khi nghe, chú ý đúng phần được tô màu.'),
        h('div.wordrow', {}, s.words.map(function (w) { return wordButton(w.w, key, w.vi); }))
      ),
      h('div.card', { style: { marginTop: '14px' } },
        h('h3', {}, 'Chữ viết thường gặp'),
        h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
          s.spelling.map(function (sp) { return h('span.sound-chip', { style: { '--c': soundVar(key), fontSize: '13.5px', fontWeight: '700' }, text: sp }); })
        ),
        pair ? h('p.muted', { style: { marginTop: '12px', marginBottom: 0 } },
          'Luôn so sánh với cặp của nó: ' + s.ipa + ' và ' + SOUNDS[pair].ipa + ' có cùng vị trí lưỡi, chỉ khác ở độ rung.') : null
      )
    );
  };
}

/* ---------- Slide quy tac ---------- */
function slideRule(which) {
  const r = RULES[which];
  return function () {
    return h('div', {},
      sectionHead('Quy tắc', r.title, r.lead),
      h('div.card', {}, r.rows.map(function (row) {
        return h('div.rule', { style: { '--c': row.color } },
          h('div.rule__out', { text: row.out }),
          h('div', {},
            h('div.rule__when', { text: row.when }),
            h('div.wordrow', {}, row.ex.map(function (w) {
              const key = row.out.replace(/[/ɪ]/g, '') || 's';
              const sk = SOUND_ORDER.indexOf(key) >= 0 ? key : 's';
              return wordButton(w, sk, null, row.out.length > 3 ? 2 : undefined);
            }))
          )
        );
      })),
      h('div.card', { style: { marginTop: '14px' } },
        h('h3', {}, '💡 Mẹo kiểm tra trong một giây'),
        h('p', { style: { margin: 0 }, text: r.note })
      )
    );
  };
}

/* ---------- Slide tong ket ---------- */
function slideWrap() {
  const items = [
    ['Chạm lưỡi là đủ', 'Không cần bật mạnh, chỉ cần không bỏ qua.'],
    ['Không thêm "ơ" ở cuối', '"Like" chứ không phải "lai-kơ".'],
    ['Sờ cổ họng để chọn vô thanh hay hữu thanh', '/t/ /s/ /k/ không rung. /d/ /z/ có rung.'],
    ['Đuôi -s theo âm đứng trước', 'Vô thanh thì /s/, hữu thanh thì /z/.'],
    ['Đuôi -ed cũng vậy', 'Vô thanh thì /t/, hữu thanh thì /d/, sau /t/ /d/ thì /ɪd/.'],
    ['Ghi âm mỗi ngày hai phút', 'Nghe lại chính mình là cách sửa nhanh nhất.']
  ];
  return h('div', {},
    sectionHead('Tổng kết', 'Mang sáu điều này về nhà',
      'Bài sau sẽ nói về cấu trúc câu trả lời Speaking. Nhưng trước đó, hãy để âm cuối thành phản xạ.'),
    h('div.card', {}, items.map(function (it, i) {
      return h('div.check', {}, h('div.check__n', { text: String(i + 1) }),
        h('div', {}, h('b', { text: it[0] }), h('div.muted', { text: it[1] })));
    })),
    h('div.card', { style: { marginTop: '14px' } },
      h('h3', {}, '📝 Bài tập về nhà'),
      h('p', {}, 'Mỗi tối, chọn một đoạn ngắn khoảng năm câu từ bất kỳ nguồn nào bạn thích. Gạch chân mọi âm cuối thuộc năm âm đã học, đọc to và ghi âm. Nghe lại một lần, sửa những chỗ bị nuốt, rồi đọc lại.'),
      h('p.muted', { style: { margin: 0 } }, 'Hai phút mỗi ngày, trong hai tuần, sẽ đổi hẳn cách người khác nghe bạn nói.')
    )
  );
}

/* ---------- Danh sach slide ---------- */
const SLIDES = [
  { title: 'Giới thiệu bài học', build: slideCover },
  { title: 'Vì sao âm cuối quan trọng', build: slideWhy },
  { title: 'Bốn nguyên tắc', build: slidePrinciple },
  { title: 'Bản đồ năm âm', build: slideMap },
  { title: 'Âm /t/', build: slideSound('t') },
  { title: 'Âm /d/', build: slideSound('d') },
  { title: 'Âm /k/', build: slideSound('k') },
  { title: 'Âm /s/', build: slideSound('s') },
  { title: 'Âm /z/', build: slideSound('z') },
  { title: 'Quy tắc đuôi -s', build: slideRule('s') },
  { title: 'Quy tắc đuôi -ed', build: slideRule('ed') },
  {
    title: 'Trò chơi 1: Nghe và chọn âm cuối',
    build: function () {
      return h('div', {}, sectionHead('Trò chơi 1', 'Nghe và chọn âm cuối',
        'Bấm loa để nghe, rồi chọn âm cuối bạn nghe được. Sai cũng không sao, cái sai cho bạn biết tai mình đang thiếu gì.'), Games.listen());
    }
  },
  {
    title: 'Trò chơi 2: Phân loại từ',
    build: function () {
      return h('div', {}, sectionHead('Trò chơi 2', 'Phân loại từ theo âm cuối',
        'Đưa mỗi từ về đúng nhóm âm. Đây là lúc bạn nối chữ viết với âm thanh.'), Games.sort());
    }
  },
  {
    title: 'Trò chơi 3: Cặp từ dễ nhầm',
    build: function () {
      return h('div', {}, sectionHead('Trò chơi 3', 'Cặp từ chỉ khác một âm cuối',
        'Đây là bài tập luyện tai quan trọng nhất. Nghe được khác biệt thì mới nói được khác biệt.'), Games.pairs());
    }
  },
  {
    title: 'Luyện đọc đoạn văn',
    build: function () {
      return h('div', {}, sectionHead('Luyện đọc', 'Đoạn văn có đánh dấu âm cuối',
        'Mọi âm cuối cần chú ý đã được tô màu. Nghe mẫu một lượt, đọc theo, rồi ghi âm chính mình.'), Games.passage());
    }
  },
  { title: 'Tổng kết và bài tập', build: slideWrap }
];

/* ---------- Dieu huong ---------- */
const Deck = (function () {
  const deck = document.getElementById('deck');
  const bar = document.getElementById('progressBar');
  const dots = document.getElementById('dots');
  const pos = document.getElementById('navpos');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const menu = document.getElementById('menu');
  const menuList = document.getElementById('menuList');
  const built = [];
  let idx = 0;

  SLIDES.forEach(function (s, i) {
    const sec = h('section.slide', { id: 'slide-' + i, 'aria-label': s.title });
    deck.appendChild(sec);
    const dot = h('button.dot', { type: 'button', title: s.title, onclick: function () { go(i); } });
    dots.appendChild(dot);
    const item = h('button.menu__item', { type: 'button', onclick: function () { go(i); closeMenu(); } },
      h('span.menu__n', { text: String(i + 1) }), h('span', { text: s.title }));
    menuList.appendChild(item);
  });

  function go(i) {
    i = Math.max(0, Math.min(SLIDES.length - 1, i));
    Speech.stop();
    idx = i;
    const sec = document.getElementById('slide-' + i);
    if (!built[i]) {
      sec.appendChild(SLIDES[i].build());
      built[i] = true;
    }
    deck.querySelectorAll('.slide').forEach(function (s) { s.classList.remove('is-active'); });
    sec.classList.add('is-active');
    bar.style.width = ((i + 1) / SLIDES.length * 100) + '%';
    pos.textContent = (i + 1) + ' / ' + SLIDES.length;
    prev.disabled = i === 0;
    next.disabled = i === SLIDES.length - 1;
    dots.querySelectorAll('.dot').forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
    menuList.querySelectorAll('.menu__item').forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
    history.replaceState(null, '', '#' + (i + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeMenu() { menu.classList.remove('is-open'); }

  prev.addEventListener('click', function () { go(idx - 1); });
  next.addEventListener('click', function () { go(idx + 1); });
  document.getElementById('menuBtn').addEventListener('click', function () { menu.classList.add('is-open'); });
  document.getElementById('menuClose').addEventListener('click', closeMenu);
  menu.addEventListener('click', function (e) { if (e.target === menu) closeMenu(); });

  document.addEventListener('keydown', function (e) {
    if (/input|select|textarea/i.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') go(idx + 1);
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(idx - 1);
    if (e.key === 'Escape') closeMenu();
  });

  let touchX = null;
  deck.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  deck.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 70) go(idx + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  const start = Math.max(0, (parseInt(location.hash.replace('#', ''), 10) || 1) - 1);
  go(start);

  return { go: go, current: function () { return idx; } };
})();

/* ---------- Thanh cong cu ---------- */
(function () {
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const saved = localStorage.getItem('amcuoi-theme');
  if (saved) root.setAttribute('data-theme', saved);
  else root.removeAttribute('data-theme');

  themeBtn.addEventListener('click', function () {
    const now = root.getAttribute('data-theme');
    const isDark = now === 'dark' || (!now && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const nextTheme = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', nextTheme);
    localStorage.setItem('amcuoi-theme', nextTheme);
    themeBtn.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
  });

  const voiceSel = document.getElementById('voiceSel');
  Speech.onVoices(function (voices, current) {
    voiceSel.innerHTML = '';
    if (!voices.length) {
      voiceSel.appendChild(h('option', { text: 'Không có giọng tiếng Anh' }));
      voiceSel.disabled = true;
      return;
    }
    voiceSel.disabled = false;
    voices.forEach(function (v) {
      voiceSel.appendChild(h('option', { value: v.name, text: v.name.replace(/^(Microsoft|Google)\s+/, '') + ' (' + v.lang + ')' }));
    });
    if (current) voiceSel.value = current.name;
  });
  voiceSel.addEventListener('change', function () { Speech.setVoice(voiceSel.value); Speech.say('ending sounds'); });

  const rate = document.getElementById('rateSel');
  rate.addEventListener('input', function () {
    Speech.setRate(Number(rate.value));
    document.getElementById('rateVal').textContent = Number(rate.value).toFixed(2) + 'x';
  });

  if (!Speech.supported()) {
    document.getElementById('ttsWarn').style.display = 'block';
  }
})();
