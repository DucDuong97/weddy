Tên Chú Rể: Dương Đức
Tên Cô Dâu: Thanh Hằng
Theme: Gold and Silver

---

# Bản Nháp Nội Dung Website Cưới (Tiếng Việt)

## 1) Cấu trúc trang

Website gồm 5 trang chính:

1. **Trang chủ (RSVP)**
2. **Trang Gallery**
3. **Story 01 - Lần đầu gặp nhau**
4. **Story 02 - Hành trình yêu**
5. **Story 03 - Lời hứa trăm năm**

## 2) Loading Screen

Nội dung loading screen:

- Loading hiển thị dưới dạng **spinner hình trái tim**.
- Tên cặp đôi hiển thị **bên trong spinner**:
  **Dương Đức & Thanh Hằng**

---

## 3) Background Slideshow (Toàn trang)

- 4 ảnh: `banner1.JPG` → `banner2.JPG` → `banner3.JPG` → `banner4.JPG`
- Chạy tự động theo vòng lặp, chuyển ảnh mỗi **6 giây**
- Hiệu ứng chuyển ảnh: **fade in/out** — `opacity` transition 1.4s ease-in-out
- Khi một ảnh đang hiển thị, áp dụng hiệu ứng **Ken Burns** (zoom in `scale(1)` → `scale(1.1)` trong 7 giây)
- `position: fixed`, `z-index: 0` — phủ kín viewport, làm nền cho toàn bộ trang
- **Hero trong suốt** — overlay tối (`::after`) chỉ áp dụng trong vùng hero để chữ dễ đọc
- **Các section bên dưới đặc/opaque** — nằm trong `.page-body` (`z-index: 1`, `background: var(--bg)`), che slideshow khi scroll xuống

---

## 4) Style Guideline (Toàn trang)

Áp dụng theme **Gold & Silver** xuyên suốt toàn trang:

| Token | Giá trị | Vai trò |
|---|---|---|
| `--bg` | `#faf8f2` | Nền kem ivory ấm |
| `--accent` | `#c9a84c` | Vàng kim — màu chủ đạo |
| `--accent-dark` | `#9a7c2e` | Vàng đậm — hover, active |
| `--text` | `#1e1a14` | Nâu tối ấm — thân văn bản |
| `--border` | `#e6d9b8` | Viền vàng nhạt |
| `--card` | `#ffffff` | Nền card |

- Font heading: **Playfair Display** (serif)
- Font body: **Be Vietnam Pro** (sans-serif)
- Nút primary: vàng kim filled; nút ghost: viền trắng (trên hero)
- Phong cách: **Elegant · Romantic · Gold & Silver Wedding**

---

## 5) Nội dung Trang Chủ (RSVP)

Trang chủ sẽ đóng vai trò trang RSVP, gồm các section sau:

### A. Hero Banner

**Hero Banner:**
- Banner chiếm toàn màn hình (`100svh`), ảnh `background-size: cover`, căn giữa
- Lớp overlay **tối ấm** phủ lên ảnh (`rgba(20, 16, 8, ~0.55)`) — giúp chữ trắng/vàng nổi rõ, không dùng teal
- Typography xếp giữa màn hình theo thứ tự từ trên xuống:
  1. Eyebrow text — chữ nhỏ, spaced, trắng mờ
  2. Flourish — đường kẻ bạc (`rgba(255,255,255,0.4)`) + biểu tượng `✦` vàng (`#c9a84c`)
  3. Tên cặp đôi — `<h1>` serif lớn, trắng, tiêu điểm chính
  4. Flourish thứ hai
  5. Subtext mô tả — nhỏ hơn, trắng mờ
  6. Dòng ngày/giờ — uppercase, spaced, bạc nhạt
- Nav: chữ trắng, nền trong suốt
- Nút CTA: ghost button (viền trắng) trên hero; gold filled ở các section còn lại
- Phong cách: **Elegant · Romantic · Gold & Silver Wedding**

**Tiêu đề gợi ý:**
> Lễ Thành Hôn Của Chúng Tôi

**Nút hành động gợi ý:**
- Xác nhận tham dự
- Xem hành trình của chúng tôi

### B. Short Story (Câu chuyện ngắn)

**Layout:** Two-column grid
- **Cột trái (content block):** Headline → Body text → CTA button
- **Cột phải (visual block):** Ảnh chân dung cặp đôi, có viền trắng kiểu ảnh in, shadow nhẹ — cân bằng bất đối xứng với cột trái

**Background:**
- Nền kem ivory (`#faf8f2`) — nhất quán với toàn trang
- Teal overlay nhạt ở góc trên bên trái (decorative, `~6% opacity`) — điểm nhấn mềm mại
- Botanical line art mờ phía cạnh phải (SVG/CSS) — tạo chiều sâu, không lấn át nội dung

**Headline:** "He asked her & she said yes!"
- Font: Playfair Display (serif), cỡ lớn
- Tông: conversational, ấm áp

**Body text:**
- Font: Be Vietnam Pro, weight 400, màu nâu trung tính
- Line-height thoáng, căn trái trong content block

**Call-to-Action Button:** "OUR LOVE STORY"
- Style: outlined — double-border decorative effect (border + outline-offset)
- Màu: vàng kim (`--accent`) — nhất quán với theme Gold & Silver
- Kiểu chữ: uppercase, spaced — lịch sự, không quá nổi

**Visual (cột phải):**
- Ảnh: `assets/story1.JPG` — chân dung couple, tông màu sáng tự nhiên
- Frame: viền trắng 8px, drop shadow — mô phỏng ảnh in
- Nhẹ xoay `-2deg` để tạo cảm giác tự nhiên, không cứng nhắc

**Design language:** Modern romantic · Minimalist · Emotional storytelling · Scroll-based flow


### C. Invitation details (Thông tin tiệc cưới)

**Layout:** 4 cards ngang hàng (grid), mỗi card chứa một nhóm thông tin  
**Background:** Trong suốt — section nằm ngoài `.page-body`, để slideshow xuyên qua bên dưới  
**Card style:** Glassmorphism — `background: rgba(255,255,255,0.1)`, `backdrop-filter: blur(6px)`, viền trắng mờ  
**Màu chữ:** Trắng; tên nhóm (heading) dùng vàng kim (`--accent`)

**Nội dung 4 cards:**

| Card | Tiêu đề | Nội dung |
|---|---|---|
| 1 | Địa điểm | Trung tâm Hội nghị Hoa Sen · 123 Đường Hạnh Phúc, TP. HCM |
| 2 | Ngày & Giờ | Thứ Bảy, 20 tháng 06 năm 2026 · 17:00 |
| 3 | Lịch trình | 16:30 Đón khách · 17:00 Lễ khai tiệc · 19:30 Kết thúc |
| 4 | Dress Code | Trang phục lịch sự · Tông màu: Trắng, Kem, Vàng kim |

**Responsive:** Trên mobile thu về 2 cột; dưới 480px thu về 1 cột

### D. Attendance Acception (Xác nhận tham dự)

**Tiêu đề gợi ý:**
> Xác Nhận Tham Dự

**Nội dung mời gợi ý:**
> Sự hiện diện của bạn là món quà quý giá nhất đối với chúng tôi.  
> Vui lòng xác nhận tham dự trước ngày [deadline] để chúng tôi đón tiếp chu đáo hơn.

**Cơ chế:**
- Tên khách mời được truyền qua **query parameter** trong URL: `?name=Nguyen+Van+A`
- Trang đọc tên từ URL, hiển thị lời chào cá nhân hoá
- Không có form nhập liệu — hành động duy nhất là nút **"Xác nhận tham dự"**

**Ví dụ URL:**
`https://example.com?name=Nguyễn+Văn+A`

**Thông điệp sau khi nhấn nút:**
> Cảm ơn [tên], bạn đã xác nhận tham dự. Hẹn gặp bạn trong ngày vui của chúng tôi!

### E. Footer (Lời mời ấm áp)

**Nội dung gợi ý:**
> Cảm ơn bạn vì đã dành thời gian ghé thăm và chia sẻ niềm vui cùng chúng tôi.  
> Chúng tôi rất mong được đón tiếp bạn trong ngày cưới.

**Dòng ký tên gợi ý:**
> Thương mến,  
> Dương Đức & Thanh Hằng

---

## 6) Nội dung cho các trang con

### Trang Gallery

**Tiêu đề:**
> Gallery - Khoảnh Khắc Yêu Thương

**Mô tả ngắn:**
> Nơi lưu giữ những khoảnh khắc đẹp nhất của chúng tôi trước ngày cưới.

### Story 01 - Lần đầu gặp nhau

**Tiêu đề:**
> Story 01 - Lần Đầu Gặp Nhau

**Mô tả ngắn:**
> Kể về ngày đầu tiên chúng tôi gặp nhau và ấn tượng đầu tiên dành cho đối phương.

### Story 02 - Hành trình yêu

**Tiêu đề:**
> Story 02 - Hành Trình Yêu

**Mô tả ngắn:**
> Những kỷ niệm đáng nhớ, những chuyến đi, và cách chúng tôi lớn lên cùng nhau.

### Story 03 - Lời hứa trăm năm

**Tiêu đề:**
> Story 03 - Lời Hứa Trăm Năm

**Mô tả ngắn:**
> Khoảnh khắc cầu hôn, quyết định về chung một nhà, và lời cảm ơn gửi đến gia đình, bạn bè.

---

## 7) Ghi chú sử dụng

- Thay các nội dung trong dấu `[]` bằng thông tin thực tế của bạn.
- Có thể giữ nguyên bố cục này để đưa thẳng vào UI/section component.
- Nếu bạn muốn, bước tiếp theo có thể tách nội dung thành JSON/CMS schema để dễ render giao diện.
