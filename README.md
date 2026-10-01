# Speaking căn bản 1: Âm cuối

Bài giảng tương tác dạng slide cho buổi học đầu tiên của khoá Speaking căn bản, tập trung vào năm âm cuối thường gặp nhất trong tiếng Anh: **/t/, /d/, /k/, /s/, /z/**.

Toàn bộ là HTML, CSS và JavaScript thuần. Không cần cài đặt, không cần build, không phụ thuộc thư viện ngoài.

## Chạy trên localhost

Nên chạy qua localhost thay vì mở thẳng file, vì trình duyệt chỉ cho phép dùng micro trên `localhost` hoặc `https`. Mở bằng `file://` thì nghe mẫu vẫn tốt nhưng nút ghi âm sẽ bị chặn.

Cách nhanh nhất, chạy trong thư mục dự án:

```bash
./serve.sh
```

Script tự tìm python hoặc node, mở trình duyệt ở `http://localhost:8080`. Muốn đổi cổng thì thêm số vào sau, ví dụ `./serve.sh 3000`. Dừng bằng `Ctrl+C`.

Nếu thích tự gõ lệnh:

```bash
python3 -m http.server 8080      # có sẵn trên macOS và Linux
npx --yes http-server -p 8080 .  # nếu máy có Node
```

Trên Windows, mở PowerShell trong thư mục dự án và chạy `python -m http.server 8080`, hoặc dùng tiện ích Live Server của VS Code (chuột phải vào `index.html` rồi chọn Open with Live Server).

Rồi mở `http://localhost:8080`. Lần đầu bấm ghi âm, trình duyệt sẽ hỏi quyền micro, chọn Cho phép.

Đưa lên GitHub Pages: vào Settings → Pages, chọn nhánh chứa mã nguồn và thư mục gốc `/`. Trang sẽ chạy ngay vì không cần bước build nào.

## Cấu trúc bài giảng (16 slide)

| Slide | Nội dung |
| --- | --- |
| 1 | Giới thiệu bài học |
| 2 | Vì sao âm cuối quan trọng |
| 3 | Bốn nguyên tắc nền tảng |
| 4 | Bản đồ năm âm |
| 5 đến 9 | Chi tiết từng âm /t/, /d/, /k/, /s/, /z/ |
| 10 | Quy tắc đuôi -s đọc /s/ hay /z/ |
| 11 | Quy tắc đuôi -ed đọc /t/ hay /d/ |
| 12 | Trò chơi 1: nghe và chọn âm cuối |
| 13 | Trò chơi 2: kéo thả phân loại từ |
| 14 | Trò chơi 3: cặp từ chỉ khác một âm cuối |
| 15 | Luyện đọc đoạn văn có đánh dấu, kèm ghi âm |
| 16 | Tổng kết và bài tập về nhà |

## Điều khiển

- Phím `←` và `→` hoặc nút tròn ở thanh dưới để chuyển slide
- Vuốt trái phải trên điện thoại
- Nút `☰ Mục lục` để nhảy tới bất kỳ slide nào
- Chọn giọng đọc và tốc độ ở thanh trên (tốc độ mặc định 0.85x cho người mới)
- Nút mặt trăng để đổi nền sáng hoặc tối
- Địa chỉ trang có lưu số slide, ví dụ `index.html#12`, nên gửi link thẳng tới một slide được

## Hai cách để học viên giữ bài giảng lại

### 1. Một file HTML tải về máy

`bai-giang-am-cuoi.html` là bản gộp toàn bộ bài giảng vào đúng một file. Học viên tải về, bấm đúp là mở, không cần mạng, không cần cài gì. Giữ nguyên mọi hiệu ứng, trò chơi và phần nghe mẫu.

Hạn chế duy nhất: trình duyệt chặn micro trên `file://` nên nút ghi âm ở slide 15 sẽ tắt, và trang tự hiện lời giải thích. Phần còn lại chạy đủ.

Tạo lại file này sau khi sửa nội dung:

```bash
node build-single.js
```

Nút tải về đã nằm sẵn ở slide cuối, nên học viên tự lấy được mà không cần thầy gửi file.

### 2. Thêm vào màn hình chính điện thoại

Bản chạy trên `https` (ví dụ GitHub Pages) là một **Progressive Web App**. Học viên mở link rồi:

- iPhone: nút chia sẻ, chọn Thêm vào MH chính
- Android: menu ba chấm, chọn Cài đặt ứng dụng

Bài giảng nằm lại trong máy như một ứng dụng riêng, có icon, mở toàn màn hình, **chạy được cả khi không có mạng**, và phần ghi âm vẫn hoạt động vì vẫn tính là `https`.

Service worker trong `sw.js` lưu sẵn trang và toàn bộ tài nguyên ngay lần mở đầu tiên. Khi thầy cập nhật bài giảng, đổi số phiên bản `am-cuoi-v1` trong `sw.js` để máy học viên tải bản mới.

## Âm thanh

Trang dùng **Web Speech API** sẵn có của trình duyệt để đọc mẫu, nên không cần chuẩn bị file mp3 nào. Chất lượng giọng phụ thuộc vào trình duyệt và hệ điều hành; Chrome và Edge thường có giọng tự nhiên nhất. Nếu danh sách giọng trống, hãy thử trình duyệt khác.

Phần ghi âm dùng `MediaRecorder` và cần quyền truy cập micro. Bản ghi chỉ nằm trong trình duyệt của học viên, không gửi đi đâu cả.

## Sửa nội dung

Gần như toàn bộ nội dung nằm trong `assets/js/data.js`:

- `SOUNDS`: mô tả từng âm, lỗi thường gặp, danh sách từ ví dụ kèm nghĩa tiếng Việt
- `GAME_WORDS`: kho từ cho trò chơi 1 và 2, mỗi từ gắn một âm cuối
- `MINIMAL_PAIRS`: các cặp từ chỉ khác nhau ở âm cuối, dùng cho trò chơi 3
- `RULES`: bảng quy tắc đuôi -s và đuôi -ed
- `PASSAGE`: đoạn văn luyện đọc. Mỗi từ ghi theo dạng `['Last', 1, 't']`, nghĩa là từ `Last`, tô màu 1 ký tự cuối, âm cuối là /t/. Từ không cần đánh dấu thì ghi `['the', 0, null]`

Thêm từ hoặc đổi đoạn văn chỉ cần sửa file này, không phải động tới phần giao diện.

## Tập tin

```
serve.sh                chạy bài giảng trên localhost
build-single.js         gộp tất cả thành một file tải về
bai-giang-am-cuoi.html  bản một file cho học viên, tạo từ lệnh trên
manifest.webmanifest    thông tin ứng dụng khi thêm vào màn hình chính
sw.js                   lưu bài giảng để dùng khi không có mạng
assets/icons/           icon ứng dụng
index.html              khung trang, thanh công cụ, mục lục
assets/css/style.css    toàn bộ giao diện, nền sáng và tối
assets/js/data.js       nội dung bài học
assets/js/speech.js     đọc mẫu và ghi âm
assets/js/ui.js         các hàm dựng giao diện dùng chung
assets/js/games.js      bốn hoạt động tương tác
assets/js/app.js        dựng slide và điều hướng
```
