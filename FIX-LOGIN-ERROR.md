# 🔧 FIX LỖI ĐĂNG NHẬP

## ❌ Lỗi hiện tại:
```
RuntimeException: Tên đăng nhập hoặc mật khẩu không đúng
```

## 🔍 Nguyên nhân:

Có 3 khả năng:

1. **Database chưa được import** → Bảng USERS không có dữ liệu
2. **Password hash sai** → Password trong database không khớp với `123456`
3. **Database sai tên** → Đang connect vào database khác

---

## ✅ GIẢI PHÁP - Làm theo thứ tự

### BƯỚC 1: Kiểm tra Database

1. Mở **MySQL Workbench**
2. Connect to `localhost:3306`
3. Mở file `check-database.sql`
4. Click **Execute** (⚡)

**Xem kết quả:**

#### Nếu không có database `GaraOToManagement`:
```
Empty set (0.00 sec)
```
→ **Chưa import database!** Đi đến BƯỚC 2

#### Nếu có database nhưng không có user admin:
```
Empty set (0.00 sec)
```
→ **Database trống!** Đi đến BƯỚC 2

#### Nếu có user admin nhưng password sai:
```
Password: $2a$10$XXXXXXXXXXXXXXX (khác với hash đúng)
```
→ **Password sai!** Đi đến BƯỚC 3

---

### BƯỚC 2: Import Database (Nếu chưa có)

#### Cách 1: Dùng SQL Script (Khuyến nghị)

1. Trong MySQL Workbench
2. **File** > **Open SQL Script**
3. Chọn file `GarageGoWeb.sql`
4. Click **Execute** (⚡)
5. Đợi script chạy xong (~30 giây)

#### Cách 2: Dùng Command Line

```bash
mysql -u root -p123456 < GarageGoWeb.sql
```

#### Kiểm tra sau khi import:

```sql
USE GaraOToManagement;
SELECT * FROM USERS;
```

**Kết quả mong đợi:**
```
UserId | Username | Email              | Role     | IsActive
-------|----------|--------------------|-----------|---------
1      | admin    | admin@garagego.com | ADMIN    | 1
2      | customer | customer@...       | CUSTOMER | 1
```

---

### BƯỚC 3: Fix Password (Nếu password sai)

#### Cách 1: Chạy script fix (Nhanh nhất)

1. Trong MySQL Workbench
2. **File** > **Open SQL Script**
3. Chọn file `fix-password.sql`
4. Click **Execute** (⚡)

#### Cách 2: Update thủ công

```sql
USE GaraOToManagement;

-- Update password cho admin
UPDATE USERS 
SET Password = '$2a$10$XGChlyDfMqFEKi9.6hnDCu.xTwylMiuwLNa13zvhCCCzitg8oRE6e' 
WHERE Username = 'admin';

-- Update password cho customer
UPDATE USERS 
SET Password = '$2a$10$XGChlyDfMqFEKi9.6hnDCu.xTwylMiuwLNa13zvhCCCzitg8oRE6e' 
WHERE Username = 'customer';

-- Kiểm tra
SELECT Username, LEFT(Password, 30) as PasswordHash FROM USERS;
```

---

### BƯỚC 4: Kiểm tra Connection String

Mở file `application.properties` và kiểm tra:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/GaraOToManagement?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&useUnicode=true
spring.datasource.username=root
spring.datasource.password=123456
```

**Đảm bảo:**
- ✅ Database name: `GaraOToManagement` (đúng chính tả)
- ✅ Port: `3306`
- ✅ Username: `root`
- ✅ Password: `123456`

---

### BƯỚC 5: Restart Backend

1. Trong IntelliJ, click **Stop** (⏹️)
2. Click **Run** (▶️) lại
3. Đợi backend khởi động xong

---

### BƯỚC 6: Test Login

#### Test bằng Swagger UI:

1. Mở: http://localhost:5102/swagger-ui.html
2. Tìm endpoint: `POST /api/auth/login`
3. Click **Try it out**
4. Nhập:
   ```json
   {
     "username": "admin",
     "password": "123456"
   }
   ```
5. Click **Execute**

**Kết quả mong đợi:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1Ni...",
  "refreshToken": "eyJhbGciOiJIUzI1Ni...",
  "username": "admin",
  "role": "ADMIN"
}
```

#### Test bằng Frontend:

1. Mở: http://localhost:3000
2. Nhập:
   - Username: `admin`
   - Password: `123456`
3. Click **Đăng nhập**

---

## 🔍 DEBUG THÊM

### Kiểm tra Backend Log

Trong IntelliJ console, tìm dòng:

```
RuntimeException: Tên đăng nhập hoặc mật khẩu không đúng
```

**Nếu thấy:**
```
User not found: admin
```
→ User không tồn tại trong database

**Nếu thấy:**
```
Bad credentials
```
→ Password sai

### Kiểm tra Database Connection

Chạy query này trong MySQL Workbench:

```sql
-- Kiểm tra connection
SELECT 1;

-- Kiểm tra database
SHOW DATABASES LIKE 'GaraOToManagement';

-- Kiểm tra charset
SHOW VARIABLES LIKE 'character_set%';

-- Kiểm tra users
USE GaraOToManagement;
SELECT COUNT(*) as TotalUsers FROM USERS;
```

---

## 📋 CHECKLIST

Sau khi làm xong, kiểm tra:

- [ ] Database `GaraOToManagement` đã tồn tại
- [ ] Bảng `USERS` có 2 records (admin, customer)
- [ ] Password hash đúng: `$2a$10$XGChlyDfMqFEKi9.6hnDCu.xTwylMiuwLNa13zvhCCCzitg8oRE6e`
- [ ] Backend đã restart
- [ ] Login thành công qua Swagger UI
- [ ] Login thành công qua Frontend

---

## 🎯 PASSWORD HASH ĐÚNG

**Quan trọng:** Password `123456` phải có hash này:

```
$2a$10$XGChlyDfMqFEKi9.6hnDCu.xTwylMiuwLNa13zvhCCCzitg8oRE6e
```

**KHÔNG PHẢI:**
- `123456` (plain text)
- `$2a$10$...` (hash khác)
- `$2b$10$...` (algorithm khác)

---

## 💡 LƯU Ý

### Nếu vẫn không login được:

1. **Xóa browser cache:**
   - F12 → Application → Clear storage
   - Hoặc Ctrl+Shift+Delete

2. **Xóa localStorage:**
   - F12 → Console
   - Chạy: `localStorage.clear()`

3. **Kiểm tra CORS:**
   - Xem Network tab trong F12
   - Kiểm tra có lỗi CORS không

4. **Kiểm tra JWT Secret:**
   - Trong `application.properties`
   - Đảm bảo `jwt.secret` có giá trị

---

## ✅ HOÀN TẤT

Sau khi làm xong các bước trên, bạn sẽ login được với:

- **Admin**: `admin / 123456`
- **Customer**: `customer / 123456`

Nếu vẫn gặp vấn đề, kiểm tra lại từng bước một!
