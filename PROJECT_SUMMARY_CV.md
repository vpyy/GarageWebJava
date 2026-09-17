# 📄 TÓM TẮT DỰ ÁN CHO CV

## **GarageGo - Hệ thống Quản lý Gara Ô tô Full-Stack**

### 🎯 **Mô tả dự án**
Ứng dụng web quản lý gara ô tô toàn diện với 2 vai trò (Admin/Customer), hỗ trợ đặt lịch dịch vụ bảo dưỡng, mua sắm phụ tùng trực tuyến, quản lý khách hàng, xe, hóa đơn và thống kê doanh thu theo thời gian thực.

---

### 💻 **Công nghệ sử dụng**

#### **Backend**
- **Framework:** Spring Boot 3.2, Java 17
- **Security:** Spring Security + JWT (Access Token 24h + Refresh Token 7d), BCrypt
- **Database:** MySQL 8.0 với triggers & stored procedures
- **ORM:** Spring Data JPA + Hibernate
- **Caching:** Redis 7
- **API Docs:** SpringDoc OpenAPI / Swagger UI
- **Build:** Maven 3.9

#### **Frontend**
- **Framework:** React 18.2 + TypeScript 4.9
- **State Management:** Redux Toolkit + React Query
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS 3.3 (Dark theme, responsive)
- **Forms:** React Hook Form + Yup validation
- **Charts:** Recharts (analytics dashboard)
- **HTTP:** Axios với interceptors (auto-refresh token)

#### **DevOps & Infrastructure**
- **Containerization:** Docker + Docker Compose
- **Web Server:** Nginx (frontend reverse proxy)
- **Database:** MySQL 8.0 (port 3307)
- **Cache:** Redis 7 (port 6379)

---

### ✨ **Tính năng chính**

#### **👤 Khách hàng (Customer)**
- ✅ Xem & đặt lịch 13 loại dịch vụ (thay dầu, rửa xe, bảo dưỡng định kỳ, sửa chữa...)
- ✅ Mua sắm 13 loại phụ tùng (dầu nhớt, lốp xe, ắc quy, phanh...) với giỏ hàng
- ✅ Theo dõi lịch sử đơn hàng & yêu cầu dịch vụ (trạng thái real-time)
- ✅ Quản lý hồ sơ cá nhân & thông tin xe (biển số, hãng, đời xe)
- ✅ Gửi liên hệ / tư vấn trực tuyến

#### **🔧 Quản trị viên (Admin)**
- ✅ Dashboard thống kê: doanh thu theo tháng (biểu đồ 12 tháng), tổng khách hàng, sản phẩm, dịch vụ
- ✅ Top 5 sản phẩm bán chạy & dịch vụ phổ biến
- ✅ Quản lý CRUD: khách hàng, xe, dịch vụ, sản phẩm, hóa đơn, yêu cầu dịch vụ
- ✅ Xử lý liên hệ từ khách hàng
- ✅ Báo cáo doanh thu theo ngày/tháng, phân tích khách hàng

#### **🔐 Bảo mật**
- ✅ JWT Authentication (Access + Refresh Token)
- ✅ BCrypt password hashing (strength 10)
- ✅ Role-Based Access Control (Admin/Customer)
- ✅ CORS configuration
- ✅ Auto-refresh token khi expired

---

### 📊 **Kiến trúc & Thiết kế**

#### **Database Schema (11 bảng)**
- `USERS`, `KHACHHANG`, `XE`, `DICHVU`, `SANPHAM`, `YEUCAU_DICHVU`, `HOADON`, `CHITIET_HDDV`, `CHITIET_HDSP`, `LIENHE`, `DONHANG`
- **Triggers:** Tự động tính tổng tiền hóa đơn, cập nhật tồn kho
- **Stored Procedures:** Đăng ký khách hàng, xác thực đăng nhập
- **Indexes:** Tối ưu tìm kiếm theo username, SĐT, biển số, ngày hóa đơn

#### **Backend Architecture (MVC Pattern)**
```
10 Controllers → 13 Services → 10 Repositories → 11 Models
+ DTOs (Request/Response) + Security (JWT Filter) + Exception Handling
```

#### **Frontend Architecture**
```
19 Pages (10 Admin + 9 Customer) + Layouts + Components
+ Redux Store (auth, cart, ui) + API Services + Type Definitions
```

---

### 📈 **Kết quả đạt được**

#### **Số liệu kỹ thuật**
- ✅ **Backend:** 10 REST API controllers, 50+ endpoints, JWT authentication
- ✅ **Frontend:** 19 trang responsive, dark theme, 9 API services
- ✅ **Database:** 11 bảng, 5 triggers, 2 stored procedures, 8 indexes
- ✅ **Docker:** 4 services (MySQL, Redis, Backend, Frontend) với health checks
- ✅ **API Documentation:** Swagger UI tích hợp sẵn

#### **Tính năng nổi bật**
- ✅ Đặt lịch dịch vụ 2-step form (chọn dịch vụ → chọn ngày/giờ)
- ✅ Giỏ hàng với multi-item selection, checkout với nhiều phương thức thanh toán
- ✅ Dashboard analytics với biểu đồ doanh thu 12 tháng (Recharts)
- ✅ Auto-refresh JWT token khi expired (Axios interceptors)
- ✅ Dark theme với gradient effects, animations, glassmorphism

#### **Deployment**
- ✅ Docker Compose: 1 lệnh chạy toàn bộ hệ thống (`docker compose up -d`)
- ✅ Health checks cho MySQL (10s), Redis (10s), Backend (15s)
- ✅ Nginx reverse proxy cho frontend
- ✅ Environment variables cho production

---

### 🎓 **Vai trò & Trách nhiệm**

**Full-Stack Developer** (100% dự án)

#### **Backend Development**
- Thiết kế database schema (11 bảng) với triggers & stored procedures
- Phát triển 10 REST API controllers với Spring Boot
- Implement JWT authentication (Access + Refresh Token)
- Tích hợp Redis caching cho performance
- Viết API documentation với Swagger

#### **Frontend Development**
- Xây dựng 19 trang responsive với React + TypeScript
- Thiết kế UI/UX với Tailwind CSS (dark theme, animations)
- Implement Redux Toolkit cho state management
- Tích hợp Axios với auto-refresh token interceptors
- Tạo dashboard analytics với Recharts

#### **DevOps & Deployment**
- Dockerize toàn bộ hệ thống (MySQL, Redis, Backend, Frontend)
- Cấu hình Nginx reverse proxy
- Setup health checks cho các services
- Viết documentation (README, API docs)

---

### 🔗 **Links**

- **GitHub:** [Link repository]
- **Demo:** [Link demo nếu có]
- **Swagger API:** http://localhost:5102/swagger-ui.html
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5102

---

### 📌 **Tóm tắt 1 đoạn (cho CV)**

> **GarageGo - Hệ thống Quản lý Gara Ô tô Full-Stack**  
> Ứng dụng web quản lý gara với 2 vai trò (Admin/Customer), hỗ trợ đặt lịch 13 loại dịch vụ, mua sắm phụ tùng, quản lý khách hàng/xe/hóa đơn và thống kê doanh thu. **Tech stack:** Java 17 + Spring Boot 3.2 + Spring Security (JWT) + MySQL 8.0 + Redis | React 18 + TypeScript + Redux Toolkit + Tailwind CSS | Docker Compose. **Kết quả:** 11 bảng database với triggers, 10 REST API controllers (50+ endpoints), 19 trang responsive với dark theme, Dockerized với health checks. **Vai trò:** Full-Stack Developer (thiết kế database, phát triển backend API, xây dựng frontend UI/UX, deployment).

---

### 📌 **Tóm tắt ngắn gọn (cho LinkedIn/Portfolio)**

> Developed a full-stack garage management system with **Spring Boot 3.2 (Java 17)** backend and **React 18 + TypeScript** frontend. Features include service booking, parts shopping, customer/vehicle management, and revenue analytics dashboard. Implemented **JWT authentication**, **Redis caching**, and **Docker deployment** with health checks. Built 50+ REST APIs, 19 responsive pages with dark theme, and integrated **Swagger documentation**.

---

### 🏆 **Điểm mạnh của dự án**

1. ✅ **Kiến trúc rõ ràng:** MVC pattern, separation of concerns
2. ✅ **Bảo mật tốt:** JWT + Refresh Token, BCrypt, RBAC
3. ✅ **Tech stack hiện đại:** Spring Boot 3.2, React 18, TypeScript
4. ✅ **Docker-ready:** Full containerization với health checks
5. ✅ **Tính năng đầy đủ:** CRUD operations, analytics, booking system
6. ✅ **Database design:** Normalization, triggers, stored procedures
7. ✅ **API documentation:** Swagger UI tích hợp
8. ✅ **Responsive UI:** Tailwind CSS, dark theme, animations

---

### 📝 **Gợi ý cải tiến (nếu phỏng vấn hỏi)**

1. **Testing:** Thêm unit tests (JUnit, Mockito), integration tests, E2E tests
2. **Performance:** Implement pagination, optimize N+1 queries, add caching strategy
3. **Security:** Rate limiting, move JWT secret to env vars, httpOnly cookies
4. **DevOps:** CI/CD pipeline (GitHub Actions), monitoring (Prometheus + Grafana)
5. **Features:** WebSocket notifications, multi-language support (i18n), image optimization

---

**Lưu ý:** Điều chỉnh nội dung phù hợp với vị trí ứng tuyển (Backend/Frontend/Full-Stack).
