# Chữa đề Cambridge Reading

Thư mục này chứa bài chữa chi tiết các đề Cambridge IELTS Reading. Nội dung được viết một lần rồi xuất ra hai dạng:

- **File Word** để in, phát cho học viên hoặc gửi qua email: `Cambridge-21-Reading-Test-1-giai-thich.docx` ở thư mục gốc dự án
- **Trang web** để chiếu lên lớp hoặc học viên tự mở trên điện thoại: `reading/index.html`

Cả hai cùng lấy dữ liệu từ `reading/word/p1.js`, `p2.js` và `p3.js`, nên sửa một chỗ là cả hai cùng đổi.

## Cách giải thích mỗi câu

Đây là phần quan trọng nhất. Bài chữa cũ đi theo bốn bước đánh số; bản này bỏ chữ "bước" và thay bằng các khối có tên gọi rõ nghĩa, để học viên đọc tới đâu hiểu mình đang làm gì tới đó.

Thứ tự các khối đúng bằng thứ tự thao tác trong phòng thi:

1. **Câu hỏi đang hỏi gì.** Diễn giải câu hỏi sang tiếng Việt thật đơn giản, rồi tách thành từng mệnh đề nhỏ. Hầu hết lỗi sai của học viên nằm ở chỗ đọc hiểu nhầm câu hỏi chứ không phải đọc nhầm bài. Với dạng điền từ thì nói rõ loại từ cần điền và giới hạn số từ.
2. **Từ khóa và cách bài đọc diễn đạt lại.** Bảng hai cột. Từ nào được giữ nguyên trong bài (tên riêng, con số, năm) thì đánh dấu để học viên biết đó là mỏ neo định vị. Từ nào bị paraphrase thì ghi rõ bài đọc viết lại thành gì.
3. **Câu quyết định trong bài đọc.** Trích nguyên văn câu chứa đáp án, in đậm đúng cụm quyết định. Chỉ trích một tới hai câu; trích dài thì học viên lại phải tự mò.
4. **Vì sao đáp án là X.** Lập luận từng bước nối câu hỏi với câu trích dẫn. Đây là chỗ giải thích, không phải chỗ nhắc lại trích dẫn.
5. **Vì sao các lựa chọn còn lại sai.** Dành cho trắc nghiệm, matching và summary có danh sách từ. Mỗi phương án một dòng.
6. **Phân biệt với đáp án dễ nhầm.** Gần như bắt buộc với TRUE/FALSE/NOT GIVEN và YES/NO/NOT GIVEN: phải nói rõ vì sao FALSE chứ không phải NOT GIVEN, hoặc ngược lại. Đây là câu hỏi mà học viên nào cũng thắc mắc, nên trả lời trước khi họ kịp hỏi.
7. **Bẫy thường gặp.** Nói đúng cái sai mà học viên hay mắc, kèm nguyên tắc để lần sau không mắc lại. Khối này nền đỏ nên lướt qua cũng thấy.
8. **Từ vựng nên nhớ.** Ba tới bốn từ, kèm loại từ và nghĩa tiếng Việt. Không nhồi cả danh sách.

Khối nào không có dữ liệu thì tự ẩn, nên không cần điền đủ tám khối cho mọi câu.

## Tạo lại file sau khi sửa nội dung

```bash
node reading/word/tao-word.js       # xuất lại file .docx ở thư mục gốc
node reading/word/tao-data-web.js   # xuất lại dữ liệu cho trang web
```

Xem trang web: chạy `./serve.sh` ở thư mục gốc rồi vào `http://localhost:8080/reading/`, hoặc bấm đúp thẳng vào `reading/index.html`.

## Thêm một đề mới

Chép `reading/word/p1.js` thành file mới cho passage của đề mới, sửa nội dung, rồi khai báo file đó trong `tao-word.js` và `tao-data-web.js`. Nhớ đổi luôn tên file đầu ra ở cuối `tao-word.js`.

## Cấu trúc một câu

```js
{
  so: 1,
  loai: 'Note completion, ONE WORD ONLY',
  de: 'nguyên văn câu hỏi trong đề',
  dapAn: 'mining',
  dapAnChu: 'H = migrant workers',   // chỉ dùng cho dạng chọn từ A tới I

  luaChon: [['A', '...'], ['B', '...']],   // chỉ dùng cho trắc nghiệm

  hoiGi: ['đoạn 1', 'đoạn 2'],
  tuKhoa: [['từ trong câu hỏi', 'cách bài viết lại', false]],  // true = giữ nguyên
  trichDan: 'câu trong bài, in đậm bằng <b>...</b>',
  nguonTrich: 'Đoạn 1',
  viSao: ['lập luận 1', 'lập luận 2'],
  phuongAn: [['A', 'vì sao sai']],
  phanBiet: [['Vì sao không phải NOT GIVEN?', '...']],
  bay: '...',
  tuVung: [['word', 'n', 'nghĩa tiếng Việt']]
}
```

Các trường chữ cho phép dùng thẻ `<b>` và `<i>` để nhấn mạnh. Riêng `de` và `dapAn` được giữ nguyên mặt chữ như trong đề gốc.

## Có sẵn trên trang web

- Nút **Ẩn đáp án** để học viên tự làm trước rồi mới soi lời giải. Di chuột vào từng ô thì hiện riêng ô đó.
- Nút **Mở tất cả** để bung hết lời giải, tiện khi chiếu lên lớp.
- Bảng đáp án nhanh ở đầu trang, bấm vào số câu là nhảy thẳng tới bài chữa của câu đó.
- Nút in ra A4 hoặc lưu PDF, bản in tự bung hết lời giải và bỏ thanh công cụ.
- Nền sáng và nền tối.
