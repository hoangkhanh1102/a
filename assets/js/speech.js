/* ===========================================================
   Speech: doc mau bang giong trinh duyet (Web Speech API)
   Recorder: thu am qua micro de hoc vien tu so sanh
   =========================================================== */

const Speech = (function () {
  let voices = [];
  let current = null;
  let rate = 0.85;
  const listeners = [];

  function score(v) {
    const n = (v.name || '').toLowerCase();
    let p = 0;
    if (/^en[-_]gb/i.test(v.lang)) p += 60;
    else if (/^en[-_]us/i.test(v.lang)) p += 50;
    else if (/^en/i.test(v.lang)) p += 30;
    else return -1;
    if (/google/.test(n)) p += 25;
    if (/natural|neural|premium|enhanced/.test(n)) p += 20;
    if (/samantha|daniel|karen|serena|aria|libby/.test(n)) p += 10;
    if (/compact|eloquence/.test(n)) p -= 10;
    return p;
  }

  function refresh() {
    const all = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    voices = all.filter(function (v) { return /^en/i.test(v.lang); })
                .sort(function (a, b) { return score(b) - score(a); });
    if (!current && voices.length) current = voices[0];
    listeners.forEach(function (fn) { fn(voices, current); });
  }

  if (window.speechSynthesis) {
    refresh();
    window.speechSynthesis.onvoiceschanged = refresh;
    setTimeout(refresh, 400);
  }

  function supported() {
    return !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
  }

  function stop() {
    if (supported()) window.speechSynthesis.cancel();
  }

  /* say(text, options)
     options: { rate, onend, onboundary, slow } */
  function say(text, options) {
    options = options || {};
    if (!supported()) {
      if (options.onend) options.onend();
      return null;
    }
    stop();
    const u = new SpeechSynthesisUtterance(text);
    if (current) { u.voice = current; u.lang = current.lang; }
    else u.lang = 'en-GB';
    u.rate = options.rate || (options.slow ? Math.max(0.5, rate - 0.25) : rate);
    u.pitch = 1;
    if (options.onend) u.onend = options.onend;
    if (options.onboundary) u.onboundary = options.onboundary;
    /* Chrome doi khi treo hang doi sau khi tab mat focus */
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(u);
    return u;
  }

  function onVoices(fn) {
    listeners.push(fn);
    if (voices.length) fn(voices, current);
  }

  return {
    say: say,
    stop: stop,
    supported: supported,
    onVoices: onVoices,
    getVoices: function () { return voices; },
    setVoice: function (name) {
      const v = voices.find(function (x) { return x.name === name; });
      if (v) current = v;
    },
    getRate: function () { return rate; },
    setRate: function (r) { rate = r; }
  };
})();

const Recorder = (function () {
  let media = null;
  let chunks = [];
  let stream = null;
  let lastUrl = null;

  function supported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }

  async function start() {
    if (!supported()) throw new Error('unsupported');
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunks = [];
    media = new MediaRecorder(stream);
    media.ondataavailable = function (e) { if (e.data.size) chunks.push(e.data); };
    media.start();
  }

  function stop() {
    return new Promise(function (resolve) {
      if (!media) return resolve(null);
      media.onstop = function () {
        const blob = new Blob(chunks, { type: media.mimeType || 'audio/webm' });
        if (lastUrl) URL.revokeObjectURL(lastUrl);
        lastUrl = URL.createObjectURL(blob);
        if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
        media = null;
        resolve(lastUrl);
      };
      media.stop();
    });
  }

  function isRecording() {
    return !!(media && media.state === 'recording');
  }

  return { supported: supported, start: start, stop: stop, isRecording: isRecording };
})();
