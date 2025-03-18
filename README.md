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

### Clone dự án:
```terminal
git clone https://github.com/tchieu0301/next-authentication.git
```

### Các URL Endpoint:
1. <p><code style="background: #333; color: #fff; padding: 2px 6px; border-radius: 4px;">/register</code></p>
- URL để kiểm tra chức năng đăng ký.
- Các trường:
    - email: Địa chỉ email của người dùng.
    - password: Mật khẩu của người dùng.
    - first_name: Tên của người dùng.
    - last_name: Họ của người dùng.
- Bao gồm validation cơ bản cho các trường.

2. <p><code style="background: #333; color: #fff; padding: 2px 6px; border-radius: 4px;">/login</code></p>
- URL để kiểm tra chức năng đăng nhập.
- Các trường:
    - email: Địa chỉ email của người dùng.
    - password: Mật khẩu của người dùng.
- Bao gồm validation cơ bản cho các trường.

3. <p><code style="background: #333; color: #fff; padding: 2px 6px; border-radius: 4px;">/forgot-password</code></p>
- URL để kiểm tra chức năng quên mật khẩu.
- Các trường:
    - email: Địa chỉ email của người dùng.
- Bao gồm validation cho email.

4. <p><code style="background: #333; color: #fff; padding: 2px 6px; border-radius: 4px;">/reset-password?token=***</code></p>
- URL để kiểm tra chức năng reset mật khẩu.
- Các trường:
    - password: Mật khẩu mới của người dùng.
- Bao gồm validation cho password.

5. <p><code style="background: #333; color: #fff; padding: 2px 6px; border-radius: 4px;">/</code></p>
- URL để kiểm tra chức năng cập nhật thông tin người dùng và đăng xuất.
- Các trường:
    - first_name: Tên của người dùng.
    - last_name: Họ của người dùng.
- Bao gồm validation cơ bản cho các trường.