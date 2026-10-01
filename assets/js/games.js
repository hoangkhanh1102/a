/* ===========================================================
   Bon hoat dong tuong tac cua bai hoc
   =========================================================== */

const Games = {};

/* -----------------------------------------------------------
   1. Nghe va chon am cuoi
   ----------------------------------------------------------- */
Games.listen = function () {
  let queue = shuffle(GAME_WORDS);
  let i = 0;
  let locked = false;

  const sc = scoreBar();
  const speaker = h('button.speaker', { type: 'button', 'aria-label': 'Phát từ' }, '🔊');
  const hint = h('p.muted', { style: { textAlign: 'center' }, text: 'Bấm loa để nghe lại. Sau đó chọn âm cuối bạn nghe được.' });
  const feedback = h('div.feedback');
  const choices = h('div.choices');
  const nextBtn = h('button.btn', { type: 'button', style: { display: 'none' } }, 'Từ tiếp theo →');

  SOUND_ORDER.forEach(function (k) {
    const s = SOUNDS[k];
    const b = h('button.choice', { type: 'button', style: { '--c': soundVar(k) } },
      s.ipa, h('small', { text: s.kind.split(',')[1] ? s.kind.split(',')[1].trim() : s.kind }));
    b.dataset.key = k;
    b.addEventListener('click', function () { answer(k, b); });
    choices.appendChild(b);
  });

  function play() {
    speaker.classList.add('is-playing');
    Speech.say(queue[i].w, { onend: function () { speaker.classList.remove('is-playing'); } });
    setTimeout(function () { speaker.classList.remove('is-playing'); }, 2200);
  }

  function answer(key, btn) {
    if (locked) return;
    locked = true;
    const item = queue[i];
    const ok = key === item.s;
    btn.classList.add(ok ? 'is-right' : 'is-wrong');
    if (!ok) {
      const right = choices.querySelector('[data-key="' + item.s + '"]');
      if (right) right.classList.add('is-right');
    } else {
      sparkle(btn);
    }
    sc.mark(ok);
    const tail = defaultTail(item.w, item.s);
    const parts = splitTail(item.w, tail);
    feedback.innerHTML = '';
    feedback.appendChild(h('div.feedback__in', { class: 'feedback__in ' + (ok ? 'ok' : 'no') },
      ok ? '✅ Chính xác. ' : '❌ Chưa đúng. ',
      'Từ vừa nghe là ',
      h('b', {}, parts[0], h('span', { style: { textDecoration: 'underline' } }, parts[1])),
      ' kết thúc bằng ' + SOUNDS[item.s].ipa + '.'
    ));
    nextBtn.style.display = '';
  }

  function next() {
    i = (i + 1) % queue.length;
    if (i === 0) queue = shuffle(queue);
    locked = false;
    feedback.innerHTML = '';
    nextBtn.style.display = 'none';
    choices.querySelectorAll('.choice').forEach(function (b) { b.classList.remove('is-right', 'is-wrong'); });
    play();
  }

  speaker.addEventListener('click', play);
  nextBtn.addEventListener('click', next);

  return h('div', {},
    sc.el,
    h('div.card', {},
      h('div.speaker-wrap', {}, speaker),
      hint,
      choices,
      feedback,
      h('div', { style: { textAlign: 'center' } }, nextBtn)
    )
  );
};

/* -----------------------------------------------------------
   2. Keo tha phan loai tu theo am cuoi
   ----------------------------------------------------------- */
Games.sort = function () {
  const sc = scoreBar();
  const pool = h('div.chiprow');
  const bins = h('div.bins');
  const msg = h('div.feedback');
  let picked = null;
  let left = 0;

  function place(chip, key, binEl) {
    const ok = chip.dataset.sound === key;
    sc.mark(ok);
    if (ok) {
      chip.classList.remove('is-picked');
      chip.classList.add('is-right');
      chip.draggable = false;
      binEl.querySelector('.bin__list').appendChild(chip);
      sparkle(chip);
      left--;
      Speech.say(chip.dataset.word);
      msg.innerHTML = '';
      if (left === 0) {
        msg.appendChild(h('div.feedback__in.ok', {}, '🎉 Xong hết rồi. Bấm "Ván mới" để đổi bộ từ khác.'));
      }
    } else {
      chip.classList.remove('is-picked');
      chip.classList.add('is-wrong');
      setTimeout(function () { chip.classList.remove('is-wrong'); }, 420);
      msg.innerHTML = '';
      msg.appendChild(h('div.feedback__in.no', {}, '❌ "' + chip.dataset.word + '" chưa thuộc nhóm ' + SOUNDS[key].ipa + '. Nghe lại rồi thử nhóm khác.'));
      Speech.say(chip.dataset.word);
    }
    picked = null;
  }

  SOUND_ORDER.forEach(function (k) {
    const bin = h('div.bin', { style: { '--c': soundVar(k) } },
      h('div.bin__h', { text: SOUNDS[k].ipa }),
      h('div.bin__list')
    );
    bin.addEventListener('dragover', function (e) { e.preventDefault(); bin.classList.add('is-over'); });
    bin.addEventListener('dragleave', function () { bin.classList.remove('is-over'); });
    bin.addEventListener('drop', function (e) {
      e.preventDefault();
      bin.classList.remove('is-over');
      const id = e.dataTransfer.getData('text/plain');
      const chip = pool.querySelector('[data-id="' + id + '"]');
      if (chip) place(chip, k, bin);
    });
    bin.addEventListener('click', function () {
      if (picked) place(picked, k, bin);
    });
    bins.appendChild(bin);
  });

  function deal() {
    pool.innerHTML = '';
    msg.innerHTML = '';
    sc.reset();
    bins.querySelectorAll('.bin__list').forEach(function (l) { l.innerHTML = ''; });
    const chosen = [];
    SOUND_ORDER.forEach(function (k) {
      const sameSound = shuffle(GAME_WORDS.filter(function (x) { return x.s === k; }));
      chosen.push(sameSound[0], sameSound[1]);
    });
    left = chosen.length;
    shuffle(chosen).forEach(function (item, idx) {
      const chip = h('div.chip', { draggable: 'true', text: item.w, title: 'Bấm để nghe, rồi bấm vào ô nhóm âm' });
      chip.dataset.id = 'c' + idx;
      chip.dataset.sound = item.s;
      chip.dataset.word = item.w;
      chip.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', chip.dataset.id);
        chip.classList.add('is-dragging');
      });
      chip.addEventListener('dragend', function () { chip.classList.remove('is-dragging'); });
      chip.addEventListener('click', function () {
        if (chip.classList.contains('is-right')) { Speech.say(item.w); return; }
        pool.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-picked'); });
        if (picked === chip) { picked = null; return; }
        picked = chip;
        chip.classList.add('is-picked');
        Speech.say(item.w);
      });
      pool.appendChild(chip);
    });
  }

  const again = h('button.btn.btn--ghost', { type: 'button', onclick: deal }, '🔀 Ván mới');
  deal();

  return h('div', {},
    sc.el,
    h('div.card', {},
      h('p.muted', {}, 'Bấm vào từ để nghe, rồi bấm vào ô nhóm âm tương ứng. Trên máy tính bạn cũng có thể kéo thả.'),
      pool,
      bins,
      msg,
      h('div', { style: { textAlign: 'center', marginTop: '6px' } }, again)
    )
  );
};

/* -----------------------------------------------------------
   3. Cap tu khac nhau o am cuoi
   ----------------------------------------------------------- */
Games.pairs = function () {
  const sc = scoreBar();
  let queue = shuffle(MINIMAL_PAIRS);
  let i = 0;
  let target = null;
  let locked = false;

  const speaker = h('button.speaker', { type: 'button', 'aria-label': 'Phát từ' }, '🎧');
  const row = h('div.choices');
  const feedback = h('div.feedback');
  const nextBtn = h('button.btn', { type: 'button', style: { display: 'none' } }, 'Cặp tiếp theo →');
  const compare = h('button.btn.btn--ghost', { type: 'button' }, '🔁 Nghe lần lượt cả hai');

  function playTarget() {
    speaker.classList.add('is-playing');
    Speech.say(target.word, { onend: function () { speaker.classList.remove('is-playing'); } });
    setTimeout(function () { speaker.classList.remove('is-playing'); }, 2000);
  }

  function render() {
    const p = queue[i];
    target = Math.random() < 0.5
      ? { word: p.a, sound: p.sa }
      : { word: p.b, sound: p.sb };
    row.innerHTML = '';
    [[p.a, p.sa, p.via], [p.b, p.sb, p.vib]].forEach(function (x) {
      const tail = defaultTail(x[0], x[1]);
      const parts = splitTail(x[0], tail);
      const b = h('button.choice', { type: 'button', style: { '--c': soundVar(x[1]) } },
        h('span', {}, parts[0], h('span', { style: { borderBottom: '3px solid ' + soundVar(x[1]) } }, parts[1])),
        h('small', { text: SOUNDS[x[1]].ipa + ' · ' + x[2] })
      );
      b.dataset.word = x[0];
      b.addEventListener('click', function () { answer(x[0], b); });
      row.appendChild(b);
    });
    feedback.innerHTML = '';
    nextBtn.style.display = 'none';
    locked = false;
    playTarget();
  }

  function answer(word, btn) {
    if (locked) return;
    locked = true;
    const ok = word === target.word;
    btn.classList.add(ok ? 'is-right' : 'is-wrong');
    if (!ok) {
      const right = row.querySelector('[data-word="' + target.word + '"]');
      if (right) right.classList.add('is-right');
    } else sparkle(btn);
    sc.mark(ok);
    feedback.innerHTML = '';
    feedback.appendChild(h('div', { class: 'feedback__in ' + (ok ? 'ok' : 'no') },
      (ok ? '✅ Đúng rồi. ' : '❌ Chưa đúng. ') + 'Từ vừa phát là "' + target.word + '", âm cuối ' + SOUNDS[target.sound].ipa + '.'
    ));
    nextBtn.style.display = '';
  }

  compare.addEventListener('click', function () {
    const p = queue[i];
    Speech.say(p.a, { onend: function () { setTimeout(function () { Speech.say(p.b); }, 350); } });
  });
  speaker.addEventListener('click', playTarget);
  nextBtn.addEventListener('click', function () {
    i = (i + 1) % queue.length;
    if (i === 0) queue = shuffle(queue);
    render();
  });

  const box = h('div', {},
    sc.el,
    h('div.card', {},
      h('div.speaker-wrap', {}, speaker),
      h('p.muted', { style: { textAlign: 'center' } }, 'Hai từ chỉ khác nhau đúng một âm cuối. Bạn vừa nghe từ nào?'),
      row,
      feedback,
      h('div', { style: { textAlign: 'center', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' } }, nextBtn, compare)
    )
  );
  render();
  return box;
};

/* -----------------------------------------------------------
   4. Doc doan van co danh dau am cuoi
   ----------------------------------------------------------- */
Games.passage = function () {
  const sentences = [];
  const wrap = h('div.passage');

  PASSAGE.forEach(function (sent, si) {
    const words = [];
    const line = h('div');
    sent.forEach(function (tok, wi) {
      /* Tach dau cau ra khoi phan chu duoc to mau */
      const m = String(tok[0]).match(/^(.*?)([.,!?;:]*)$/);
      const core = m[1];
      const punct = m[2];
      const parts = splitTail(core, tok[1]);
      const span = h('span.pw', { style: { '--c': tok[2] ? soundVar(tok[2]) : 'var(--ink)' } },
        parts[0],
        parts[1] ? h('span.tail', { text: parts[1] }) : null,
        punct ? h('span.pt', { text: punct }) : null);
      span.addEventListener('click', function () { Speech.say(core); });
      span.style.cursor = 'pointer';
      words.push(span);
      line.appendChild(span);
      if (wi < sent.length - 1) line.appendChild(document.createTextNode(' '));
    });
    const playOne = h('button.psent__play', { type: 'button', title: 'Nghe câu này', 'aria-label': 'Nghe câu ' + (si + 1) }, '▶');
    playOne.addEventListener('click', function () { speakSentence(si); });
    wrap.appendChild(h('div.psent', {}, playOne, line));
    sentences.push({ words: words, text: sent.map(function (t) { return t[0]; }).join(' '), btn: playOne });
  });

  let timer = null;
  let playingAll = false;

  function clearMarks() {
    if (timer) { clearInterval(timer); timer = null; }
    wrap.querySelectorAll('.pw.is-on').forEach(function (e) { e.classList.remove('is-on'); });
    wrap.querySelectorAll('.psent__play.is-on').forEach(function (e) { e.classList.remove('is-on'); });
  }

  function speakSentence(si, onDone) {
    clearMarks();
    const s = sentences[si];
    s.btn.classList.add('is-on');
    let boundaryWorks = false;
    const starts = [];
    let acc = 0;
    s.words.forEach(function (w, idx) {
      starts.push(acc);
      acc += s.text.split(' ')[idx].length + 1;
    });

    function mark(idx) {
      s.words.forEach(function (w, k) { w.classList.toggle('is-on', k === idx); });
    }

    /* Du phong cho trinh duyet khong ban su kien boundary */
    let k = 0;
    const est = Math.max(220, (s.text.length * 62) / (Speech.getRate() || 0.85) / s.words.length);
    timer = setInterval(function () {
      if (boundaryWorks) return;
      if (k >= s.words.length) { clearInterval(timer); timer = null; return; }
      mark(k); k++;
    }, est);

    Speech.say(s.text, {
      onboundary: function (e) {
        if (e.name && e.name !== 'word') return;
        boundaryWorks = true;
        let idx = 0;
        for (let j = 0; j < starts.length; j++) if (e.charIndex >= starts[j]) idx = j;
        mark(idx);
      },
      onend: function () {
        clearMarks();
        if (onDone) onDone();
      }
    });
  }

  function playAll() {
    playingAll = true;
    let si = 0;
    (function step() {
      if (!playingAll || si >= sentences.length) { playingAll = false; clearMarks(); return; }
      speakSentence(si, function () { si++; setTimeout(step, 420); });
    })();
  }

  const btnAll = h('button.btn', { type: 'button' }, '▶ Nghe mẫu cả đoạn');
  const btnStop = h('button.btn.btn--ghost', { type: 'button' }, '⏹ Dừng');
  btnAll.addEventListener('click', playAll);
  btnStop.addEventListener('click', function () { playingAll = false; Speech.stop(); clearMarks(); });

  /* Ghi am */
  const recBtn = h('button.btn.btn--rec', { type: 'button' }, '🎙 Ghi âm giọng bạn');
  const slot = h('div.audio-slot');
  const recMsg = h('p.muted');

  if (!Recorder.supported()) {
    recBtn.disabled = true;
    recMsg.textContent = 'Trình duyệt này không hỗ trợ ghi âm. Hãy mở trang bằng Chrome hoặc Safari qua đường dẫn https.';
  }

  recBtn.addEventListener('click', async function () {
    if (Recorder.isRecording()) {
      const url = await Recorder.stop();
      recBtn.textContent = '🎙 Ghi âm lại';
      recBtn.classList.add('btn--ghost');
      recBtn.classList.remove('btn--rec');
      slot.innerHTML = '';
      slot.appendChild(h('audio', { controls: 'controls', src: url }));
      recMsg.textContent = 'Nghe lại và tự hỏi: mình có nghe rõ âm cuối ở các chữ được tô màu không?';
      return;
    }
    try {
      Speech.stop(); clearMarks(); playingAll = false;
      await Recorder.start();
      recBtn.textContent = '⏹ Dừng ghi âm';
      recBtn.classList.remove('btn--ghost');
      recBtn.classList.add('btn--rec');
      recMsg.textContent = 'Đang ghi âm. Đọc chậm, chạm rõ từng âm cuối đã tô màu.';
    } catch (err) {
      recMsg.textContent = 'Không truy cập được micro. Hãy cho phép quyền micro trong trình duyệt rồi thử lại.';
    }
  });

  const legend = h('div.legend', {}, SOUND_ORDER.map(function (k) {
    return h('span.legend__i', { style: { '--c': soundVar(k) } }, h('i'), SOUNDS[k].ipa);
  }));

  return h('div', {},
    legend,
    h('div.card', {}, wrap),
    h('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' } }, btnAll, btnStop, recBtn),
    slot,
    recMsg,
    h('details', { style: { marginTop: '16px' } },
      h('summary', { style: { cursor: 'pointer', fontWeight: '700', color: 'var(--ink-2)' } }, 'Xem nghĩa tiếng Việt'),
      h('p.muted', { style: { marginTop: '10px' }, text: PASSAGE_VI })
    )
  );
};
