# 🚗 GarageGo — Hệ thống quản lý gara ô tô

<div align="center">

![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-green?logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)

**Ứng dụng quản lý gara ô tô full-stack với giao diện hiện đại, hỗ trợ đặt lịch dịch vụ, mua sắm phụ tùng và quản lý toàn diện.**

</div>

---

## 📝 DỰ ÁN

### **GarageGo - Hệ thống quản lý gara ô tô Full-Stack**

**Mô tả ngắn gọn:**
Ứng dụng web quản lý gara ô tô toàn diện với 2 vai trò (Admin/Customer), hỗ trợ đặt lịch dịch vụ, mua sắm phụ tùng, quản lý khách hàng, xe, hóa đơn và thống kê doanh thu.

**Công nghệ sử dụng:**
- **Backend:** Java 17, Spring Boot 3.2, Spring Security, JWT Authentication, Spring Data JPA, MySQL 8.0, Redis
- **Frontend:** React 18, TypeScript, Redux Toolkit, React Router v6, Tailwind CSS, Axios, React Hook Form
- **DevOps:** Docker Compose, Nginx, Maven

**Tính năng chính:**
- **Khách hàng:** Đặt lịch dịch vụ (13 loại), mua phụ tùng (giỏ hàng), theo dõi đơn hàng, quản lý hồ sơ & xe
- **Admin:** Dashboard thống kê, quản lý CRUD (khách hàng, xe, dịch vụ, sản phẩm, hóa đơn), báo cáo doanh thu
- **Bảo mật:** JWT (Access + Refresh Token), BCrypt, Role-based Access Control, CORS

**Kết quả:**
- 11 bảng database với triggers/stored procedures tự động hóa
- 10 REST API controllers với 50+ endpoints
- 19 trang frontend responsive với dark theme
- Dockerized với health checks cho MySQL, Redis, Backend
- API documentation với Swagger UI

**Vai trò:** Full-Stack Developer (thiết kế database, phát triển backend API, xây dựng frontend UI/UX, deployment)

---

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Chạy bằng Docker](#-chạy-bằng-docker-khuyến-nghị)
- [Chạy local (không Docker)](#-chạy-local-không-docker)
- [Tài khoản mặc định](#-tài-khoản-mặc-định)
- [API Documentation](#-api-documentation)
- [Cấu hình](#-cấu-hình)

---

## ✨ Tính năng

### 👤 Khách hàng
- Xem danh sách dịch vụ bảo dưỡng & sửa chữa
- Đặt lịch dịch vụ trực tuyến (2-step form)
- Mua sắm phụ tùng ô tô (giỏ hàng, chọn nhiều sản phẩm)
- Theo dõi lịch sử đơn hàng & yêu cầu dịch vụ
- Gửi liên hệ / tư vấn
- Quản lý hồ sơ cá nhân

### 🔧 Quản trị viên
- Dashboard thống kê doanh thu theo tháng
- Quản lý khách hàng, xe, dịch vụ, sản phẩm
- Quản lý hóa đơn, yêu cầu dịch vụ
- Xử lý liên hệ từ khách hàng
- Báo cáo & thống kê chi tiết

### 🔐 Bảo mật
- JWT Authentication (Access Token 24h + Refresh Token 7 ngày)
- BCrypt password hashing
- Role-based access control (Admin / Customer)
- CORS configuration

---

## 🛠 Công nghệ sử dụng

| Layer | Công nghệ |
|-------|-----------|
| **Backend** | Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA |
| **Frontend** | React 18, TypeScript, Redux Toolkit, Tailwind CSS |
| **Database** | MySQL 8.0 (UTF-8mb4) |
| **Cache** | Redis 7 (Docker) / Simple Cache (local) |
| **Auth** | JWT (jjwt 0.12.3) |
| **API Docs** | SpringDoc OpenAPI / Swagger UI |
| **Container** | Docker, Docker Compose, Nginx |
| **Build** | Maven 3.9, Node.js 18 |

---

## 📁 Cấu trúc dự án

```
GarageGoWeb/
├── docker-compose.yml          # Orchestration toàn bộ services
├── GarageGoWeb.sql             # Database schema + seed data
├── .env.example                # Template biến môi trường
│
├── GarageGo-BEJava/            # Spring Boot Backend
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/garagego/
│       ├── config/             # Security, Redis, CORS
│       ├── controller/         # REST API endpoints
│       ├── service/            # Business logic
│       ├── repository/         # JPA repositories
│       ├── model/              # JPA entities
│       ├── dto/                # Request/Response DTOs
│       ├── security/           # JWT filter, UserDetails
│       └── util/               # JWT utility
│
└── GarageGo-FE/                # React Frontend
    ├── Dockerfile
    ├── nginx.conf              # Nginx proxy config
    └── src/
        ├── pages/
        │   ├── admin/          # Dashboard, quản lý
        │   ├── customer/       # Trang khách hàng
        │   └── auth/           # Login, Register
        ├── components/
        │   ├── layouts/        # PublicLayout, AdminLayout
        │   └── admin/          # Sidebar, Header
        ├── store/              # Redux store + slices
        ├── services/           # API service calls
        └── types/              # TypeScript interfaces
```

---

## 🐳 Chạy bằng Docker (Khuyến nghị)

### Yêu cầu
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ≥ 24.0
- Docker Compose ≥ 2.0

### Các bước

**1. Clone repository**
```bash
git clone https://github.com/vpyy/GarageWebJava.git
cd GarageWebJava
```

**2. Khởi động toàn bộ hệ thống**
```bash
docker compose up -d
```

> Lần đầu chạy sẽ mất 3–5 phút để build images và khởi tạo database.

**3. Kiểm tra trạng thái**
```bash
docker compose ps
```

Kết quả mong đợi:
```
NAME                 STATUS
garagego-mysql       Up (healthy)
garagego-redis       Up (healthy)
garagego-backend     Up
garagego-frontend    Up
```

**4. Mở trình duyệt**

| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:5102/api |
| 📖 Swagger UI | http://localhost:5102/swagger-ui.html |
| 🗄️ MySQL | localhost:3307 |

### Dừng hệ thống
```bash
docker compose down
```

### Dừng và xóa toàn bộ dữ liệu
```bash
docker compose down -v
```

### Rebuild sau khi thay đổi code
```bash
# Rebuild tất cả
docker compose up -d --build

# Rebuild chỉ backend
docker compose up -d --build backend

# Rebuild chỉ frontend
docker compose up -d --build frontend
```

### Xem logs
```bash
# Tất cả services
docker compose logs -f

# Chỉ backend
docker compose logs -f backend

# Chỉ frontend
docker compose logs -f frontend
```

---

## 💻 Chạy local (không Docker)

Dùng khi cần debug hoặc phát triển tính năng mới.

### Yêu cầu
- Java 17+
- Maven 3.9+
- Node.js 18+
- MySQL 8.0 (local hoặc XAMPP)

### Bước 1: Setup MySQL

Mở MySQL Workbench hoặc command line:
```bash
mysql -u root -p < GarageGoWeb.sql
```

Hoặc trong MySQL Workbench: **File → Open SQL Script → GarageGoWeb.sql → Execute**

### Bước 2: Chạy Backend (IntelliJ IDEA)

1. Mở IntelliJ IDEA → **File → Open** → chọn folder `GarageGo-BEJava`
2. Đợi Maven import dependencies
3. Click **Run** ▶️ hoặc `Shift+F10`

Hoặc dùng Maven:
```bash
cd GarageGo-BEJava
mvn spring-boot:run
```

> Backend chạy tại: http://localhost:5102

### Bước 3: Chạy Frontend (CMD/Terminal)

```bash
cd GarageGo-FE
npm install
npm start
```

> Frontend chạy tại: http://localhost:3000

### Lưu ý khi chạy local

`application.properties` đã được cấu hình sẵn cho local:
- Database: `localhost:3306`
- Cache: Simple in-memory (không cần Redis)

---

## 🔑 Tài khoản mặc định

| Vai trò | Username | Password | Giao diện |
|---------|----------|----------|-----------|
| **Admin** | `admin` | `123456` | `/admin/dashboard` |
| **Customer** | `customer` | `123456` | `/customer/home` |

---

## 📡 API Documentation

Swagger UI: http://localhost:5102/swagger-ui.html

### Các endpoint chính

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/login` | Đăng nhập | Public |
| POST | `/api/auth/register` | Đăng ký | Public |
| POST | `/api/auth/refresh` | Refresh token | Public |
| GET | `/api/dich-vu` | Danh sách dịch vụ | Public |
| GET | `/api/san-pham` | Danh sách sản phẩm | Public |
| POST | `/api/yeu-cau` | Đặt lịch dịch vụ | Customer/Admin |
| POST | `/api/don-hang` | Tạo đơn hàng | Customer/Admin |
| GET | `/api/don-hang/my-orders` | Đơn hàng của tôi | Customer/Admin |
| GET | `/api/thong-ke/dashboard` | Dashboard thống kê | Admin |
| POST | `/api/lien-he` | Gửi liên hệ | Public |

---

## ⚙️ Cấu hình

### Biến môi trường Docker

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `DB_PASSWORD` | `123456` | Mật khẩu MySQL |
| `JWT_SECRET` | *(base64)* | Secret key cho JWT |
| `REDIS_HOST` | `redis` | Host Redis |
| `REDIS_PORT` | `6379` | Port Redis |
| `SPRING_PROFILES_ACTIVE` | `docker` | Spring profile |

### Ports

| Service | Container Port | Host Port |
|---------|---------------|-----------|
| Frontend (Nginx) | 80 | 3000 |
| Backend (Spring Boot) | 5102 | 5102 |
| MySQL | 3306 | 3307 |
| Redis | 6379 | 6379 |

### Spring Profiles

| Profile | Dùng khi | Database | Cache |
|---------|----------|----------|-------|
| `default` | Local development | `localhost:3306` | Simple (in-memory) |
| `docker` | Docker container | `mysql:3306` | Redis |

---

## 🗄️ Database

Schema được khởi tạo tự động từ `GarageGoWeb.sql` khi chạy Docker lần đầu.

### Các bảng chính

```
USERS           — Tài khoản người dùng
KHACHHANG       — Thông tin khách hàng
XE              — Xe của khách hàng
DICHVU          — Danh mục dịch vụ
SANPHAM         — Danh mục sản phẩm
YEUCAU_DICHVU   — Yêu cầu đặt lịch dịch vụ
HOADON          — Hóa đơn
CHITIET_HDDV    — Chi tiết hóa đơn dịch vụ
CHITIET_HDSP    — Chi tiết hóa đơn sản phẩm
LIENHE          — Liên hệ từ khách hàng
```

### Reset database

```bash
# Xóa volume MySQL và khởi động lại
docker compose down -v
docker compose up -d
```

---

## 🔧 Troubleshooting

### Backend không kết nối được MySQL

```bash
# Kiểm tra MySQL đã healthy chưa
docker compose ps mysql

# Xem logs MySQL
docker compose logs mysql
```

### Frontend không gọi được API

Kiểm tra nginx.conf đã proxy đúng chưa:
```nginx
location /api/ {
    proxy_pass http://backend:5102/api/;
}
```

### Lỗi 403 sau khi đăng nhập

Xóa localStorage trong browser:
```javascript
// F12 → Console
localStorage.clear(); location.reload();
```

### Dữ liệu tiếng Việt bị lỗi encoding

```bash
# Xóa database và khởi tạo lại
docker exec garagego-mysql mysql -u root -p123456 -e "DROP DATABASE GaraOToManagement;"
docker cp GarageGoWeb.sql garagego-mysql:/tmp/init.sql
docker exec garagego-mysql mysql -u root -p123456 --default-character-set=utf8mb4 < /tmp/init.sql
docker compose restart backend
```

---

## 📝 License

MIT License — Tự do sử dụng cho mục đích học tập và phát triển.

---

<div align="center">
Made with ❤️ by <strong>GarageGo Team</strong>
</div>
