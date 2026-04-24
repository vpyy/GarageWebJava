# 🚗 GarageGo - Hệ thống Quản lý Garage Ô tô

Hệ thống quản lý garage ô tô toàn diện với Spring Boot backend và React frontend.

## 📋 Tính năng chính

### 👨‍💼 Quản trị viên (Admin)
- ✅ Quản lý sản phẩm (phụ tùng, phụ kiện)
- ✅ Quản lý dịch vụ (sửa chữa, bảo dưỡng)
- ✅ Quản lý khách hàng
- ✅ Quản lý xe
- ✅ Quản lý hóa đơn
- ✅ Quản lý yêu cầu dịch vụ
- ✅ Quản lý liên hệ
- ✅ Thống kê doanh thu
- ✅ Dashboard tổng quan

### 👤 Khách hàng (Customer)
- ✅ Đăng ký/Đăng nhập
- ✅ Xem sản phẩm và dịch vụ
- ✅ Đặt hàng online
- ✅ Đặt lịch dịch vụ
- ✅ Xem lịch sử đơn hàng
- ✅ Quản lý thông tin cá nhân
- ✅ Gửi liên hệ

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│                   (React Frontend)                       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Spring Boot Backend (Java 17)               │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Controllers (REST API)                          │  │
│  │  - AuthController, ProductController, etc.       │  │
│  └────────────────┬─────────────────────────────────┘  │
│                   │                                      │
│  ┌────────────────▼─────────────────────────────────┐  │
│  │  Services (Business Logic)                       │  │
│  │  - JWT Authentication, CRUD Operations           │  │
│  └────────────────┬─────────────────────────────────┘  │
│                   │                                      │
│  ┌────────────────▼─────────────────────────────────┐  │
│  │  Repositories (Data Access)                      │  │
│  │  - Spring Data JPA                               │  │
│  └────────────────┬─────────────────────────────────┘  │
└───────────────────┼──────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌───────────────┐       ┌───────────────┐
│  MySQL 8.0    │       │  Redis 7      │
│  (Database)   │       │  (Cache)      │
└───────────────┘       └───────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.x
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Cache**: Redis 7
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA (Hibernate)
- **Build Tool**: Maven
- **API Documentation**: Swagger/OpenAPI 3

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Routing**: React Router v6
- **State Management**: React Context API
- **UI Components**: Custom components
- **HTTP Client**: Fetch API
- **Build Tool**: Create React App

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (for frontend)

## 🚀 Quick Start

### Cách 1: Docker Compose (Khuyến nghị)

```bash
# 1. Clone repository
git clone <repo-url>
cd GarageGo

# 2. Copy environment file
cp .env.example .env

# 3. Start all services
docker compose up -d --build

# 4. Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5102/api
# Swagger: http://localhost:5102/swagger-ui.html
```

📖 **Chi tiết:** Xem [DOCKER_SETUP_GUIDE.md](./DOCKER_SETUP_GUIDE.md)

### Cách 2: Local Development

#### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0
- Redis 7
- Maven 3.9+

#### Backend Setup
```bash
cd GarageGo-BEJava

# Configure database in application.properties
# spring.datasource.url=jdbc:mysql://localhost:3306/GaraOToManagement
# spring.datasource.password=your_password

# Run application
mvn spring-boot:run
```

#### Frontend Setup
```bash
cd GarageGo-FE

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start
```

## 📁 Cấu trúc dự án

```
GarageGo/
├── GarageGo-BEJava/              # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/garagego/
│   │   │   │   ├── config/       # Configuration classes
│   │   │   │   ├── controller/   # REST Controllers
│   │   │   │   ├── dto/          # Data Transfer Objects
│   │   │   │   ├── exception/    # Exception handlers
│   │   │   │   ├── model/        # JPA Entities
│   │   │   │   ├── repository/   # Spring Data Repositories
│   │   │   │   ├── security/     # Security components
│   │   │   │   └── service/      # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── Dockerfile
│   ├── pom.xml
│   ├── MIGRATION_NOTES.md        # API migration guide
│   └── SPRING_BOOT_STANDARDS.md  # Best practices
│
├── GarageGo-FE/                  # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── contexts/             # Context providers
│   │   ├── pages/                # Page components
│   │   ├── services/             # API services
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml            # Production compose
├── docker-compose.dev.yml        # Development compose
├── .env.example                  # Environment template
├── GarageGoWeb.sql              # Database schema
├── DOCKER_SETUP_GUIDE.md        # Docker guide
└── README.md                     # This file
```

## 🔐 Authentication & Authorization

### JWT Authentication
- **Access Token**: 24 giờ
- **Refresh Token**: 7 ngày
- **Token Rotation**: Refresh token được rotate khi sử dụng

### Roles
- **ADMIN**: Full access
- **CUSTOMER**: Limited access (own data only)

### Protected Endpoints
```
/api/auth/login          → Public
/api/auth/register       → Public
/api/san-pham/**         → GET: Public, POST/PUT/DELETE: ADMIN
/api/dich-vu/**          → GET: Public, POST/PUT/DELETE: ADMIN
/api/thong-ke/**         → ADMIN only
/api/hoa-don/**          → ADMIN only
/api/khach-hang/**       → ADMIN only
```

## 📊 Database Schema

### Main Tables
- `Users` - User accounts
- `RefreshTokens` - JWT refresh tokens
- `KhachHang` - Customers
- `Xe` - Vehicles
- `SanPham` - Products
- `DichVu` - Services
- `HoaDon` - Invoices
- `ChiTietHDSP` - Invoice product details
- `ChiTietHDDV` - Invoice service details
- `YeucauDichVu` - Service requests
- `LienHe` - Contact messages

## 🔄 API Endpoints

### Authentication
```
POST   /api/auth/login           # Login
POST   /api/auth/register        # Register
POST   /api/auth/refresh         # Refresh token
POST   /api/auth/logout          # Logout
GET    /api/auth/me              # Get current user
```

### Products (Sản phẩm)
```
GET    /api/san-pham             # Get all products
GET    /api/san-pham/{id}        # Get product by ID
GET    /api/san-pham/in-stock    # Get in-stock products
GET    /api/san-pham/search?q=   # Search products
POST   /api/san-pham             # Create product (ADMIN)
PUT    /api/san-pham/{id}        # Update product (ADMIN)
DELETE /api/san-pham/{id}        # Delete product (ADMIN)
```

### Services (Dịch vụ)
```
GET    /api/dich-vu              # Get all services
GET    /api/dich-vu/{id}         # Get service by ID
GET    /api/dich-vu/active       # Get active services
POST   /api/dich-vu              # Create service (ADMIN)
PUT    /api/dich-vu/{id}         # Update service (ADMIN)
DELETE /api/dich-vu/{id}         # Delete service (ADMIN)
```

### Statistics (Thống kê)
```
GET    /api/thong-ke/dashboard           # Dashboard data
GET    /api/thong-ke/doanh-thu-theo-ngay # Revenue by date
GET    /api/thong-ke/top-san-pham        # Top products
GET    /api/thong-ke/top-dich-vu         # Top services
```

📖 **Full API Documentation**: http://localhost:5102/swagger-ui.html

## 🧪 Testing

### Backend Tests
```bash
cd GarageGo-BEJava
mvn test
```

### Frontend Tests
```bash
cd GarageGo-FE
npm test
```

## 📝 Recent Changes

### ✨ Spring Boot Standardization (Latest)
- ✅ Đổi endpoint URLs từ PascalCase → kebab-case
- ✅ Loại bỏ `Map<String, Object>` responses → Typed DTOs
- ✅ Cải thiện error handling với GlobalExceptionHandler
- ✅ Thêm validation cho request DTOs
- ✅ Chuẩn hóa date handling với `@DateTimeFormat`
- ✅ Xóa duplicate endpoints

📖 **Chi tiết:** Xem [MIGRATION_NOTES.md](./GarageGo-BEJava/MIGRATION_NOTES.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- Backend Developer: [Your Name]
- Frontend Developer: [Your Name]
- DevOps: [Your Name]

## 📞 Support

- Email: support@garagego.com
- Documentation: [Wiki](./wiki)
- Issues: [GitHub Issues](./issues)

---

Made with ❤️ by GarageGo Team
