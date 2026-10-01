#!/usr/bin/env node
/* ===========================================================
   Gop toan bo bai giang thanh mot file HTML duy nhat
   de hoc vien tai ve va mo offline.

   Chay: node build-single.js
   =========================================================== */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'bai-giang-am-cuoi.html');

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

/* Giu nguyen noi dung script va style, chi can tranh dong the dong som */
function safe(code) {
  return code.replace(/<\/script>/gi, '<\\/script>');
}

/* 1. Nhung file CSS */
html = html.replace(
  /<link rel="stylesheet" href="(assets\/css\/[^"]+)">/g,
  function (_, file) { return '<style>\n' + read(file) + '\n</style>'; }
);

/* 2. Nhung cac file JavaScript theo dung thu tu trong trang */
html = html.replace(
  /<script src="(assets\/js\/[^"]+)"><\/script>/g,
  function (_, file) { return '<script>\n' + safe(read(file)) + '\n</script>'; }
);

/* 3. Ban tai ve khong dung manifest va icon rieng */
html = html.replace(/\n<link rel="manifest"[^>]*>/g, '');
html = html.replace(/\n<link rel="apple-touch-icon"[^>]*>/g, '');

/* 4. Ghi chu o dau file cho nguoi mo bang trinh soan thao */
html = html.replace('<head>',
  '<head>\n<!-- Speaking can ban 1: Am cuoi. Ban offline mot file, tao bang build-single.js. -->');

fs.writeFileSync(OUT, html, 'utf8');

const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
console.log('Đã tạo ' + path.basename(OUT) + ' (' + kb + ' KB)');
