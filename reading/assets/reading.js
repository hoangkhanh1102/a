/* ===========================================================
   Chua de Cambridge Reading - dung giao dien tu window.DE_READING
   =========================================================== */

(function () {
  'use strict';

  var DE = window.DE_READING;
  var deck = document.getElementById('deck');
  var tabs = document.getElementById('tabs');
  var keyGrid = document.getElementById('keyGrid');
  var passageHien = 0;

  /* Thoat ky tu de tranh vo cau truc trang.
     Noi dung bai chua la do giao vien viet nen cac truong
     giai thich van cho phep the dinh dang don gian. */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function doanVan(noiDung) {
    if (!noiDung) return '';
    var ds = Array.isArray(noiDung) ? noiDung : [noiDung];
    return ds.map(function (p) { return '<p>' + p + '</p>'; }).join('');
  }

  function khoi(tieuDe, noiDungHTML) {
    if (!noiDungHTML) return '';
    return '<div class="blk"><div class="blk__h">' + esc(tieuDe) + '</div>' + noiDungHTML + '</div>';
  }

  /* ---------- Bang dap an nhanh ---------- */

  function dungBangDapAn() {
    keyGrid.innerHTML = '';
    DE.passages.forEach(function (p, pi) {
      p.cauHoi.forEach(function (c) {
        var cell = el('button', 'keycell');
        cell.type = 'button';
        cell.innerHTML =
          '<span class="keycell__n">' + esc(c.so) + '</span>' +
          '<span class="keycell__a">' + esc(c.dapAn) + '</span>';
        cell.title = 'Câu ' + c.so + ': ' + c.dapAn;
        cell.addEventListener('click', function () { nhayToiCau(pi, c.so); });
        keyGrid.appendChild(cell);
      });
    });
  }

  function nhayToiCau(pi, so) {
    if (pi !== passageHien) { chonPassage(pi); }
    var t = document.getElementById('cau-' + so);
    if (!t) return;
    t.classList.add('q--open');
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Mot the cau hoi ---------- */

  function dungCauHoi(c) {
    var q = el('article', 'q');
    q.id = 'cau-' + c.so;

    var lopDapAn = 'q__ans-val';
    if (c.sacThai === 'no') lopDapAn += ' q__ans-val--no';
    if (c.sacThai === 'warn') lopDapAn += ' q__ans-val--warn';

    var head = el('button', 'q__head');
    head.type = 'button';
    head.innerHTML =
      '<span class="q__no">' + esc(c.so) + '</span>' +
      '<span class="q__mid">' +
        (c.loai ? '<span class="q__tag">' + esc(c.loai) + '</span>' : '') +
        '<div class="q__text">' + esc(c.de) + '</div>' +
      '</span>' +
      '<span class="q__right">' +
        '<span class="' + lopDapAn + '">' + esc(c.dapAn) + '</span>' +
        '<span class="q__chev">▶</span>' +
      '</span>';
    head.addEventListener('click', function () { q.classList.toggle('q--open'); });

    var html = '';

    /* Thong tin nhanh cho dang dien tu */
    var meta = [];
    if (c.gioiHan) meta.push('<p><b>Giới hạn số từ:</b> ' + esc(c.gioiHan) + '</p>');
    if (c.loaiTu) meta.push('<p><b>Loại từ cần điền:</b> ' + esc(c.loaiTu) + '</p>');
    if (c.viTri) meta.push('<p><b>Vị trí trong bài:</b> ' + esc(c.viTri) + '</p>');

    html += khoi('Câu hỏi đang hỏi gì', doanVan(c.hieuDe) + meta.join(''));

    /* Bang tu khoa */
    if (c.tuKhoa && c.tuKhoa.length) {
      var rows = c.tuKhoa.map(function (k) {
        return '<li data-keep="' + (k.giuNguyen ? '1' : '0') + '">' +
          '<span class="kw__from">' + esc(k.goc) + '</span>' +
          '<span class="kw__arr">' + (k.giuNguyen ? '=' : '→') + '</span>' +
          '<span class="kw__to">' + esc(k.trongBai) + '</span>' +
          (k.note ? '<span class="kw__note" style="grid-column:1/-1;font-size:13.5px;color:var(--ink-3)">' + k.note + '</span>' : '') +
        '</li>';
      }).join('');
      html += khoi('Từ khóa và cách bài đọc diễn đạt lại', '<ul class="kw">' + rows + '</ul>');
    }

    /* Trich dan */
    if (c.trichDan) {
      html += khoi('Câu quyết định trong bài đọc',
        '<blockquote class="quote">' + c.trichDan.text +
        (c.trichDan.nguon ? '<span class="quote__src">' + esc(c.trichDan.nguon) + '</span>' : '') +
        '</blockquote>');
    }

    html += khoi('Đối chiếu câu hỏi với bài đọc', doanVan(c.doiChieu));

    /* Ket luan */
    if (c.vangAnh) {
      html += '<div class="verdict">' +
        '<span class="verdict__ic">' + esc(c.vangAnh.icon || '✓') + '</span>' +
        '<span class="verdict__t">' + c.vangAnh.text + '</span>' +
      '</div>';
    }

    /* Phan biet voi dap an gan giong */
    if (c.phanBiet && c.phanBiet.length) {
      var pb = c.phanBiet.map(function (x) {
        return '<p><b>' + esc(x.nhan) + '</b> ' + x.giaiThich + '</p>';
      }).join('');
      html += khoi('Phân biệt với đáp án dễ nhầm', pb);
    }

    /* Vi sao cac lua chon khac sai - danh cho trac nghiem */
    if (c.loaiSai && c.loaiSai.length) {
      var ls = c.loaiSai.map(function (x) {
        return '<p><b>' + esc(x.chon) + ':</b> ' + x.viSao + '</p>';
      }).join('');
      html += khoi('Vì sao các lựa chọn còn lại sai', ls);
    }

    if (c.luuYChinhTa) {
      html += khoi('Lưu ý khi viết đáp án', '<p>' + c.luuYChinhTa + '</p>');
    }

    if (c.tuongDuong && c.tuongDuong.length) {
      html += '<p class="alt"><b>Đáp án được chấp nhận tương đương:</b> ' +
        c.tuongDuong.map(esc).join(' · ') + '</p>';
    }

    if (c.bay) {
      html += '<div class="trap"><b>Bẫy thường gặp. </b>' + c.bay + '</div>';
    }

    if (c.tuVung && c.tuVung.length) {
      var tv = c.tuVung.map(function (t) {
        return '<div class="vocab__row">' +
          '<span class="vocab__w">' + esc(t.tu) + '</span>' +
          '<span class="vocab__p">' + esc(t.loai) + '</span>' +
          '<span class="vocab__m">' + esc(t.nghia) + '</span>' +
        '</div>';
      }).join('');
      html += khoi('Từ vựng nên nhớ', '<div class="vocab">' + tv + '</div>');
    }

    q.appendChild(head);
    q.appendChild(el('div', 'q__body', html));
    return q;
  }

  /* ---------- Passage ---------- */

  function chonPassage(i) {
    passageHien = i;
    Array.prototype.forEach.call(tabs.children, function (t, k) {
      t.classList.toggle('tab--on', k === i);
    });

    var p = DE.passages[i];
    deck.innerHTML = '';
    deck.appendChild(el('h2', 'psg-title', 'Passage ' + p.so + ': ' + esc(p.ten)));
    if (p.dangCauHoi) deck.appendChild(el('p', 'psg-sub', esc(p.dangCauHoi)));

    if (!p.cauHoi || !p.cauHoi.length) {
      deck.appendChild(el('div', 'empty', 'Chưa có bài chữa cho passage này.'));
      return;
    }
    p.cauHoi.forEach(function (c) { deck.appendChild(dungCauHoi(c)); });
  }

  function dungTabs() {
    tabs.innerHTML = '';
    DE.passages.forEach(function (p, i) {
      var b = el('button', 'tab', 'Passage ' + p.so);
      b.type = 'button';
      b.addEventListener('click', function () { chonPassage(i); });
      tabs.appendChild(b);
    });
  }

  /* ---------- Thanh cong cu ---------- */

  function gopPhimTat() {
    var btnKeys = document.getElementById('keysBtn');
    var btnOpen = document.getElementById('openBtn');
    var btnTheme = document.getElementById('themeBtn');
    var btnPrint = document.getElementById('printBtn');

    btnKeys.addEventListener('click', function () {
      var an = document.body.classList.toggle('hide-keys');
      btnKeys.textContent = an ? '👁 Hiện đáp án' : '🙈 Ẩn đáp án';
      btnKeys.classList.toggle('tool--on', an);
    });

    btnOpen.addEventListener('click', function () {
      var cards = deck.querySelectorAll('.q');
      var moHet = deck.querySelectorAll('.q--open').length < cards.length;
      Array.prototype.forEach.call(cards, function (c) {
        c.classList.toggle('q--open', moHet);
      });
      btnOpen.textContent = moHet ? '⌃ Thu gọn' : '⌄ Mở tất cả';
    });

    btnTheme.addEventListener('click', function () {
      var toi = document.documentElement.getAttribute('data-theme') === 'dark';
      document.documentElement.setAttribute('data-theme', toi ? 'light' : 'dark');
      btnTheme.textContent = toi ? '🌙' : '☀️';
    });

    btnPrint.addEventListener('click', function () { window.print(); });
  }

  /* ---------- Khoi dong ---------- */

  if (!DE || !DE.passages) {
    deck.innerHTML = '<div class="empty">Chưa nạp được dữ liệu đề. ' +
      'Kiểm tra lại thẻ script trỏ tới file trong thư mục <code>data/</code>.</div>';
    return;
  }

  document.getElementById('deTen').textContent = DE.ten;
  document.getElementById('deNguon').textContent = DE.nguon || '';
  document.title = DE.ten + ' | Chữa đề Reading';

  var oNote = document.getElementById('note');
  if (DE.ghiChu) { oNote.innerHTML = '<b>Ghi chú. </b>' + DE.ghiChu; }
  else { oNote.style.display = 'none'; }

  dungBangDapAn();
  dungTabs();
  chonPassage(0);
  gopPhimTat();
})();
