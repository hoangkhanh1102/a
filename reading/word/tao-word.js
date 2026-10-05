/* ===========================================================
   Tao file Word giai thich dap an Cambridge 21 Reading Test 1
   Chay: node reading/word/tao-word.js
   =========================================================== */

const fs = require('fs');
const path = require('path');
const d = require('docx');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, HeadingLevel,
  Footer, PageNumber, TableOfContents, LevelFormat, PageBreak
} = d;

const C = {
  brand: '3B35A8', ink: '141A2A', ink2: '44506A', ink3: '7A849A',
  ok: '12703A', no: 'B02B45', teal: '0B7A70', amber: '9A5B08',
  line: 'D8DEEC'
};
const BG = {
  de: 'F2F4FB', dapAn: 'E6F5EC', quote: 'E3F4F2', bay: 'FCEBEF',
  head: 'EDEFFA', row: 'F6F8FD'
};

const W = 9000;               /* be ngang vung noi dung, don vi DXA */
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER,
                    insideHorizontal: NO_BORDER, insideVertical: NO_BORDER };

/* ---------- Doc markup <b> va <i> thanh cac TextRun ---------- */
function runs(text, base) {
  base = base || {};
  const out = [];
  const re = /<(b|i)>([\s\S]*?)<\/\1>/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(new TextRun(Object.assign({}, base, { text: text.slice(last, m.index) })));
    out.push(new TextRun(Object.assign({}, base, {
      text: m[2], bold: m[1] === 'b' || base.bold, italics: m[1] === 'i' || base.italics
    })));
    last = re.lastIndex;
  }
  if (last < text.length) out.push(new TextRun(Object.assign({}, base, { text: text.slice(last) })));
  return out;
}

const p = (text, opt) => {
  opt = opt || {};
  return new Paragraph(Object.assign({
    children: runs(text, { size: opt.size || 21, color: opt.color || C.ink2, font: opt.font }),
    spacing: { before: opt.before == null ? 40 : opt.before, after: opt.after == null ? 60 : opt.after, line: 288 },
    alignment: opt.align, indent: opt.indent
  }, opt.extra || {}));
};

/* Nhan nho in hoa dat truoc moi khoi giai thich */
const nhan = (text) => new Paragraph({
  children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 17, color: C.brand, characterSpacing: 14 })],
  spacing: { before: 200, after: 60 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.line, space: 4 } }
});

/* Mot doan co nen mau, dung cho de bai, trich dan, bay */
function hop(text, bg, vien, opt) {
  opt = opt || {};
  return new Paragraph({
    children: runs(text, { size: opt.size || 21, color: opt.color || C.ink, italics: opt.italics }),
    shading: { type: ShadingType.CLEAR, fill: bg, color: 'auto' },
    border: {
      left: { style: BorderStyle.SINGLE, size: 18, color: vien, space: 8 },
      top: { style: BorderStyle.SINGLE, size: 2, color: bg, space: 6 },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: bg, space: 6 },
      right: { style: BorderStyle.SINGLE, size: 2, color: bg, space: 6 }
    },
    spacing: { before: 60, after: 80, line: 288 }
  });
}

function cell(children, width, bg) {
  return new TableCell({
    children: children,
    width: { size: width, type: WidthType.DXA },
    shading: bg ? { type: ShadingType.CLEAR, fill: bg, color: 'auto' } : undefined,
    margins: { top: 70, bottom: 70, left: 110, right: 110 }
  });
}

function bang(cols, rows, opt) {
  opt = opt || {};
  return new Table({
    columnWidths: cols,
    width: { size: cols.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    borders: opt.borders || {
      top: { style: BorderStyle.SINGLE, size: 2, color: C.line },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: C.line },
      left: { style: BorderStyle.SINGLE, size: 2, color: C.line },
      right: { style: BorderStyle.SINGLE, size: 2, color: C.line },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: C.line },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: C.line }
    },
    rows: rows
  });
}

/* ---------- Dung phan giai thich cho mot cau ---------- */
function dungCau(c) {
  const out = [];

  out.push(new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 100 },
    children: [
      new TextRun({ text: 'Câu ' + c.so, bold: true, size: 26, color: C.brand }),
      new TextRun({ text: '    ' + c.loai, size: 18, color: C.ink3 })
    ]
  }));

  out.push(hop(c.de, BG.de, C.brand, { italics: true }));

  /* Cac lua chon cua cau trac nghiem */
  if (c.luaChon) {
    c.luaChon.forEach(function (lc) {
      const dung = lc[0] === c.dapAn;
      out.push(new Paragraph({
        children: [
          new TextRun({ text: lc[0] + '   ', bold: true, size: 21, color: dung ? C.ok : C.ink3 }),
          new TextRun({ text: lc[1], size: 21, color: dung ? C.ok : C.ink2, bold: dung })
        ],
        indent: { left: 340 }, spacing: { before: 20, after: 20 }
      }));
    });
  }

  out.push(new Paragraph({
    children: [
      new TextRun({ text: 'ĐÁP ÁN:  ', bold: true, size: 20, color: C.ok }),
      new TextRun({ text: c.dapAnChu || c.dapAn, bold: true, size: 24, color: C.ok })
    ],
    shading: { type: ShadingType.CLEAR, fill: BG.dapAn, color: 'auto' },
    border: {
      left: { style: BorderStyle.SINGLE, size: 18, color: C.ok, space: 8 },
      top: { style: BorderStyle.SINGLE, size: 2, color: BG.dapAn, space: 6 },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: BG.dapAn, space: 6 },
      right: { style: BorderStyle.SINGLE, size: 2, color: BG.dapAn, space: 6 }
    },
    spacing: { before: 80, after: 140 }
  }));

  out.push(nhan('Câu hỏi đang hỏi gì'));
  c.hoiGi.forEach(function (t) { out.push(p(t)); });

  if (c.tuKhoa && c.tuKhoa.length) {
    out.push(nhan('Từ khóa và cách bài đọc diễn đạt lại'));
    const rows = [new TableRow({
      tableHeader: true,
      children: [
        cell([p('Trong câu hỏi', { size: 18, color: C.brand, extra: { children: runs('Trong câu hỏi', { size: 18, color: C.brand, bold: true }) } })], 3900, BG.head),
        cell([new Paragraph({ children: [new TextRun({ text: 'Trong bài đọc', bold: true, size: 18, color: C.brand })] })], 5100, BG.head)
      ]
    })];
    c.tuKhoa.forEach(function (k, i) {
      const bg = i % 2 ? BG.row : undefined;
      rows.push(new TableRow({
        children: [
          cell([new Paragraph({ children: [new TextRun({ text: k[0], size: 20, color: C.ink, bold: true })] })], 3900, bg),
          cell([new Paragraph({
            children: [
              new TextRun({ text: k[2] ? 'giữ nguyên: ' : '', size: 18, color: C.teal, bold: true }),
              new TextRun({ text: k[1], size: 20, color: C.ink2, italics: true })
            ]
          })], 5100, bg)
        ]
      }));
    });
    out.push(bang([3900, 5100], rows));
    out.push(new Paragraph({ text: '', spacing: { after: 60 } }));
  }

  if (c.trichDan) {
    out.push(nhan('Câu quyết định trong bài đọc'));
    out.push(hop(c.trichDan, BG.quote, C.teal));
    if (c.nguonTrich) {
      out.push(new Paragraph({
        children: [new TextRun({ text: c.nguonTrich, size: 17, color: C.ink3, italics: true })],
        spacing: { before: 0, after: 80 }
      }));
    }
  }

  out.push(nhan('Vì sao đáp án là ' + (c.dapAn)));
  c.viSao.forEach(function (t) { out.push(p(t, { extra: { bullet: { level: 0 } } })); });

  if (c.phuongAn && c.phuongAn.length) {
    out.push(nhan(c.luaChon ? 'Vì sao các lựa chọn còn lại sai' : 'Vì sao các phương án khác không khớp'));
    c.phuongAn.forEach(function (x) {
      out.push(new Paragraph({
        children: [new TextRun({ text: x[0] + '. ', bold: true, size: 21, color: C.no })].concat(runs(x[1], { size: 21, color: C.ink2 })),
        spacing: { before: 40, after: 40, line: 288 }, indent: { left: 200 }
      }));
    });
  }

  if (c.phanBiet && c.phanBiet.length) {
    out.push(nhan('Phân biệt với đáp án dễ nhầm'));
    c.phanBiet.forEach(function (x) {
      out.push(new Paragraph({
        children: [new TextRun({ text: x[0] + ' ', bold: true, size: 21, color: C.ink })].concat(runs(x[1], { size: 21, color: C.ink2 })),
        spacing: { before: 40, after: 40, line: 288 }
      }));
    });
  }

  if (c.bay) {
    out.push(nhan('Bẫy thường gặp'));
    out.push(hop(c.bay, BG.bay, C.no));
  }

  if (c.tuVung && c.tuVung.length) {
    out.push(nhan('Từ vựng nên nhớ'));
    const rows = c.tuVung.map(function (t, i) {
      const bg = i % 2 ? BG.row : undefined;
      return new TableRow({ children: [
        cell([new Paragraph({ children: [new TextRun({ text: t[0], bold: true, size: 20, color: C.ink })] })], 2500, bg),
        cell([new Paragraph({ children: [new TextRun({ text: t[1], size: 18, color: C.ink3, italics: true })] })], 1100, bg),
        cell([new Paragraph({ children: [new TextRun({ text: t[2], size: 20, color: C.ink2 })] })], 5400, bg)
      ] });
    });
    out.push(bang([2500, 1100, 5400], rows));
  }

  return out;
}

/* ---------- Bang dap an nhanh 40 cau ---------- */
function bangDapAn(tatCa) {
  const cot = 4, moiCot = 10;
  const rows = [new TableRow({
    tableHeader: true,
    children: [].concat.apply([], new Array(cot).fill(0).map(function () {
      return [
        cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Câu', bold: true, size: 17, color: C.brand })] })], 700, BG.head),
        cell([new Paragraph({ children: [new TextRun({ text: 'Đáp án', bold: true, size: 17, color: C.brand })] })], 1550, BG.head)
      ];
    }))
  })];

  for (let r = 0; r < moiCot; r++) {
    const cells = [];
    for (let k = 0; k < cot; k++) {
      const q = tatCa[k * moiCot + r];
      const bg = r % 2 ? BG.row : undefined;
      cells.push(cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(q.so), bold: true, size: 19, color: C.ink3 })] })], 700, bg));
      cells.push(cell([new Paragraph({ children: [new TextRun({ text: q.dapAn, bold: true, size: 19, color: C.ok })] })], 1550, bg));
    }
    rows.push(new TableRow({ children: cells }));
  }
  return bang([700, 1550, 700, 1550, 700, 1550, 700, 1550], rows);
}

/* ---------- Dung tai lieu ---------- */
const PS = [require('./p1.js'), require('./p2.js'), require('./p3.js')];
const tatCa = [].concat.apply([], PS.map(function (x) { return x.cau; }));

const body = [];

/* Trang bia */
body.push(new Paragraph({ text: '', spacing: { before: 1400 } }));
body.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'CAMBRIDGE IELTS 21', bold: true, size: 30, color: C.ink3, characterSpacing: 60 })],
  spacing: { after: 160 }
}));
body.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'READING TEST 1', bold: true, size: 56, color: C.brand })],
  spacing: { after: 100 }
}));
body.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'Giải thích chi tiết 40 câu', size: 30, color: C.ink2 })],
  spacing: { after: 500 }
}));
body.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  border: { top: { style: BorderStyle.SINGLE, size: 6, color: C.line, space: 14 } },
  children: [new TextRun({ text: 'The Davies Sisters   ·   Why we need silence   ·   The World of Sugar', size: 21, color: C.ink3, italics: true })],
  spacing: { before: 200, after: 700 }
}));

body.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'Cách dùng tài liệu này', bold: true, size: 24, color: C.ink })],
  spacing: { after: 120 }
}));
[
  'Hãy tự làm hết đề trước, bấm giờ đủ 60 phút, rồi mới mở tài liệu này ra. Đọc lời giải khi chưa làm bài thì bạn chỉ đang đọc truyện, không phải đang luyện thi.',
  'Với mỗi câu, tài liệu đi đúng theo thứ tự thao tác mà bạn nên làm trong phòng thi: hiểu câu hỏi muốn gì, nhận ra từ khóa nào bị diễn đạt lại, tìm câu quyết định trong bài, rồi mới chốt đáp án.',
  'Phần đáng giá nhất không phải là đáp án, mà là mục Bẫy thường gặp ở cuối mỗi câu. Những câu bạn làm sai gần như luôn rơi vào đúng các bẫy đó. Đọc kỹ phần này và ghi lại bẫy nào bạn đã mắc.',
  'IELTS Reading không khó như nhiều người nghĩ. Đề không bắt bạn phải biết nhiều từ hiếm hay suy luận cao siêu. Nó chỉ kiểm tra một việc duy nhất: bạn có đọc đúng cái mà bài viết thực sự nói hay không.'
].forEach(function (t) {
  body.push(new Paragraph({
    children: runs(t, { size: 21, color: C.ink2 }),
    spacing: { before: 60, after: 60, line: 300 },
    alignment: AlignmentType.JUSTIFIED
  }));
});

body.push(new Paragraph({ children: [new PageBreak()] }));

/* Bang dap an */
body.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text: 'Bảng đáp án nhanh', bold: true, size: 32, color: C.brand })],
  spacing: { before: 0, after: 200 }
}));
body.push(bangDapAn(tatCa));
body.push(new Paragraph({
  children: [new TextRun({ text: 'Đáp án đối chiếu với answer key chính thức của Cambridge IELTS 21, trang 118.', size: 18, color: C.ink3, italics: true })],
  spacing: { before: 140 }
}));

/* Tung passage */
PS.forEach(function (ps) {
  body.push(new Paragraph({ children: [new PageBreak()] }));
  body.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text: 'PASSAGE ' + ps.so + ': ' + ps.ten, bold: true, size: 32, color: C.brand })],
    spacing: { before: 0, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: C.brand, space: 8 } }
  }));
  body.push(p(ps.tomTat, { before: 180, after: 80 }));
  body.push(new Paragraph({
    children: [
      new TextRun({ text: 'Các dạng câu hỏi:  ', bold: true, size: 20, color: C.ink }),
      new TextRun({ text: ps.dang, size: 20, color: C.ink2 })
    ],
    spacing: { before: 40, after: 80 }
  }));
  if (ps.luuYChung) {
    body.push(hop('<b>Lưu ý chung cho phần này. </b>' + ps.luuYChung, BG.de, C.amber));
  }
  ps.cau.forEach(function (c) {
    dungCau(c).forEach(function (x) { body.push(x); });
  });
});

const doc = new Document({
  creator: 'IELTS Reading',
  title: 'Cambridge IELTS 21 Reading Test 1, giải thích chi tiết',
  description: 'Giải thích đáp án 40 câu Reading Test 1 trong Cambridge IELTS 21',
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 21, color: C.ink2 } },
      heading1: { run: { font: 'Calibri', size: 32, bold: true, color: C.brand }, paragraph: { spacing: { before: 300, after: 160 } } },
      heading2: { run: { font: 'Calibri', size: 26, bold: true, color: C.brand }, paragraph: { spacing: { before: 360, after: 100 } } }
    }
  },
  numbering: {
    config: [{
      reference: 'cham-tron',
      levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
                 style: { paragraph: { indent: { left: 360, hanging: 200 } } } }]
    }]
  },
  sections: [{
    properties: { page: { margin: { top: 1300, bottom: 1300, left: 1440, right: 1440 } } },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Cambridge IELTS 21, Reading Test 1   |   ', size: 16, color: C.ink3 }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.ink3 })
          ]
        })]
      })
    },
    children: body
  }]
});

const OUT = path.join('/home/user/a', 'Cambridge-21-Reading-Test-1-giai-thich.docx');
Packer.toBuffer(doc).then(function (buf) {
  fs.writeFileSync(OUT, buf);
  console.log('Đã tạo ' + OUT + ' (' + (buf.length / 1024).toFixed(1) + ' KB), ' + tatCa.length + ' câu');
}).catch(function (e) { console.error('LOI:', e); process.exit(1); });
