/* Chuyen du lieu chua bai sang dinh dang cho trang web reading/index.html */
const fs = require('fs');
const PS = [require('./p1.js'), require('./p2.js'), require('./p3.js')];

function doiCau(c) {
  const o = {
    so: c.so,
    loai: c.loai,
    de: c.de,
    dapAn: c.dapAnChu || c.dapAn,
    sacThai: ['FALSE', 'NO'].indexOf(c.dapAn) >= 0 ? 'no'
           : (c.dapAn === 'NOT GIVEN' ? 'warn' : 'ok'),
    hieuDe: c.hoiGi.slice(),
    tuKhoa: c.tuKhoa.map(k => ({ goc: k[0], trongBai: k[1], giuNguyen: !!k[2] })),
    doiChieu: c.viSao.slice(),
    vangAnh: {
      icon: ['FALSE', 'NO'].indexOf(c.dapAn) >= 0 ? '✕' : (c.dapAn === 'NOT GIVEN' ? '?' : '✓'),
      text: 'Đáp án là <b>' + (c.dapAnChu || c.dapAn) + '</b>.'
    },
    bay: c.bay,
    tuVung: (c.tuVung || []).map(t => ({ tu: t[0], loai: t[1], nghia: t[2] }))
  };
  if (c.trichDan) o.trichDan = { text: c.trichDan, nguon: c.nguonTrich };
  if (c.phanBiet) o.phanBiet = c.phanBiet.map(x => ({ nhan: x[0], giaiThich: x[1] }));
  if (c.phuongAn) o.loaiSai = c.phuongAn.map(x => ({ chon: x[0], viSao: x[1] }));
  if (c.luaChon) {
    o.hieuDe = ['<b>Các lựa chọn:</b> ' + c.luaChon.map(l =>
      (l[0] === c.dapAn ? '<b>' + l[0] + '. ' + l[1] + '</b>' : l[0] + '. ' + l[1])).join('  |  ')
    ].concat(o.hieuDe);
  }
  return o;
}

const DE = {
  ma: 'cam21-test1',
  ten: 'Cambridge IELTS 21, Reading Test 1',
  nguon: 'Giải thích chi tiết 40 câu',
  ghiChu: 'Hãy tự làm hết đề trong 60 phút rồi mới mở bài chữa. Phần đáng giá nhất của mỗi câu là mục Bẫy thường gặp ở cuối.',
  passages: PS.map(ps => ({
    so: ps.so, ten: ps.ten, dangCauHoi: ps.dang, cauHoi: ps.cau.map(doiCau)
  }))
};

fs.writeFileSync(
  '/home/user/a/reading/data/cam21-test1.js',
  '/* Tao tu dong bang reading/word/tao-data-web.js. Khong sua truc tiep file nay. */\n' +
  'window.DE_READING = ' + JSON.stringify(DE, null, 2) + ';\n',
  'utf8'
);
console.log('Đã tạo reading/data/cam21-test1.js với ' + DE.passages.reduce((n, p) => n + p.cauHoi.length, 0) + ' câu');
