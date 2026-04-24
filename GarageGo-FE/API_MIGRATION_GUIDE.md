# Frontend API Migration Guide

## ⚠️ BREAKING CHANGES

Backend đã được chuẩn hóa theo Spring Boot best practices. Tất cả API endpoints đã đổi từ **PascalCase** sang **kebab-case**.

## 📋 Danh sách thay đổi

### Authentication Endpoints
```diff
- /api/Auth/login       → /api/auth/login
- /api/Auth/register    → /api/auth/register
- /api/Auth/refresh     → /api/auth/refresh
- /api/Auth/logout      → /api/auth/logout
- /api/Auth/me          → /api/auth/me
```

### Product Endpoints
```diff
- /api/SanPham          → /api/san-pham
- /api/SanPham/{id}     → /api/san-pham/{id}
- /api/SanPham/InStock  → /api/san-pham/in-stock
- /api/SanPham/search   → /api/san-pham/search
```

### Service Endpoints
```diff
- /api/DichVu           → /api/dich-vu
- /api/DichVu/{id}      → /api/dich-vu/{id}
- /api/DichVu/Active    → /api/dich-vu/active
- /api/DichVu/search    → /api/dich-vu/search
```

### Customer Endpoints
```diff
- /api/KhachHang        → /api/khach-hang
- /api/KhachHang/{id}   → /api/khach-hang/{id}
- /api/KhachHang/sdt/{sdt} → /api/khach-hang/sdt/{sdt}
```

### Vehicle Endpoints
```diff
- /api/Xe               → /api/xe
- /api/Xe/{id}          → /api/xe/{id}
- /api/Xe/ByKhachHang/{id} → /api/xe/customer/{id}
- /api/Xe/ByBienSo/{bienSo} → /api/xe/bien-so/{bienSo}
```

### Invoice Endpoints
```diff
- /api/HoaDon           → /api/hoa-don
- /api/HoaDon/{id}      → /api/hoa-don/{id}
- /api/HoaDon/{id}/Complete → /api/hoa-don/{id}/complete
```

### Order Endpoints
```diff
- /api/DonHang          → /api/don-hang
```

### Service Request Endpoints
```diff
- /api/Yeucau           → /api/yeu-cau
- /api/Yeucau/{id}      → /api/yeu-cau/{id}
- /api/Yeucau/{id}/status → /api/yeu-cau/{id}/status
```

### Contact Endpoints
```diff
- /api/LienHe           → /api/lien-he
- /api/LienHe/update-status → /api/lien-he/update-status
```

### Statistics Endpoints
```diff
- /api/ThongKe/TongQuan → /api/thong-ke/tong-quan
- /api/ThongKe/Dashboard → /api/thong-ke/dashboard
- /api/ThongKe/DoanhThuTheoThang → /api/thong-ke/doanh-thu-theo-thang
- /api/ThongKe/DoanhThuTheoNgay → /api/thong-ke/doanh-thu-theo-ngay
- /api/ThongKe/TopDichVu → /api/thong-ke/top-dich-vu
- /api/ThongKe/TopSanPham → /api/thong-ke/top-san-pham
- /api/ThongKe/HoaDonGanDay → /api/thong-ke/hoa-don-gan-day
- /api/ThongKe/TopKhachHang → /api/thong-ke/top-khach-hang
```

## 🔧 Files cần cập nhật

### Service Files (src/services/)
- ✅ authService.ts
- ✅ productService.ts
- ✅ serviceService.ts
- ✅ customerService.ts
- ✅ vehicleService.ts
- ✅ invoiceService.ts
- ✅ requestService.ts
- ✅ contactService.ts
- ✅ statisticsService.ts

### Page Files với hardcoded URLs
- ✅ src/pages/customer/ProductsPage.tsx
- ✅ src/pages/customer/ServicesPage.tsx
- ✅ src/pages/customer/ServiceBookingPage.tsx
- ✅ src/pages/customer/CustomerHomePage.tsx

## 🚀 Cách cập nhật

### Tự động (Khuyến nghị)
Chạy script migration:
```bash
cd GarageGo-FE
node scripts/migrate-api-endpoints.js
```

### Thủ công
Tìm và thay thế trong toàn bộ dự án:

1. **Authentication:**
   - Find: `/Auth/` → Replace: `/auth/`

2. **Products:**
   - Find: `/SanPham` → Replace: `/san-pham`
   - Find: `/InStock` → Replace: `/in-stock`

3. **Services:**
   - Find: `/DichVu` → Replace: `/dich-vu`
   - Find: `/Active` → Replace: `/active`

4. **Customers:**
   - Find: `/KhachHang` → Replace: `/khach-hang`

5. **Vehicles:**
   - Find: `/Xe/ByKhachHang` → Replace: `/xe/customer`
   - Find: `/Xe/ByBienSo` → Replace: `/xe/bien-so`
   - Find: `/Xe` → Replace: `/xe`

6. **Invoices:**
   - Find: `/HoaDon` → Replace: `/hoa-don`
   - Find: `/Complete` → Replace: `/complete`

7. **Orders:**
   - Find: `/DonHang` → Replace: `/don-hang`

8. **Service Requests:**
   - Find: `/Yeucau` → Replace: `/yeu-cau`

9. **Contacts:**
   - Find: `/LienHe` → Replace: `/lien-he`

10. **Statistics:**
    - Find: `/ThongKe` → Replace: `/thong-ke`
    - Find: `/TongQuan` → Replace: `/tong-quan`
    - Find: `/Dashboard` → Replace: `/dashboard`
    - Find: `/DoanhThuTheoThang` → Replace: `/doanh-thu-theo-thang`
    - Find: `/DoanhThuTheoNgay` → Replace: `/doanh-thu-theo-ngay`
    - Find: `/TopDichVu` → Replace: `/top-dich-vu`
    - Find: `/TopSanPham` → Replace: `/top-san-pham`
    - Find: `/HoaDonGanDay` → Replace: `/hoa-don-gan-day`
    - Find: `/TopKhachHang` → Replace: `/top-khach-hang`

## ✅ Testing Checklist

Sau khi migration, test các chức năng:

- [ ] Login/Register
- [ ] View products list
- [ ] View services list
- [ ] Create service request
- [ ] Create order
- [ ] View customer profile
- [ ] View vehicles
- [ ] Admin dashboard
- [ ] Statistics pages

## 📝 Notes

- Không cần thay đổi request/response body structure
- Chỉ cần thay đổi URL paths
- Backend vẫn accept cả PascalCase và camelCase trong request body (nhờ @JsonAlias)
