## NextJS Authentication.

### Kết nối Database:
1. Truy cập https://www.heidisql.com/download.php
2. Tải phiên bản mới nhất
3. Mở HeidiSQL lên và thiết lập thông tin host:
Ví dụ:
![Alt text](/public/readme/step_1.png)
4. Tiếp theo mở host lên và tạo database tên next-authentication
![Alt text](/public/readme/step_2.png)
5. Vào file db.ts để sửa đổi thông tin database giống với thông tin mà bạn đã thiết lập

### Các URL Endpoint:
1. <p><code style="background: #333; color: #fff; padding: 2px 6px; border-radius: 4px;">/register</code></p>
- URL để kiểm tra chức năng đăng ký.
- Các trường trong phần đăng ký bao gồm: email, password, first_name, last_name.
- Bao gồm validation cơ bản cho các trường.
