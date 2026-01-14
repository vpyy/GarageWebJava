-- =============================================
-- QUẢN LÝ GARA Ô TÔ - MYSQL VERSION
-- Chuyển đổi từ SQL Server sang MySQL
-- =============================================
-- Drop database nếu đã tồn tại
DROP DATABASE IF EXISTS GaraOToManagement;
-- Tạo database mới với charset UTF-8
CREATE DATABASE GaraOToManagement CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE GaraOToManagement;
-- =============================================
-- TẠO CÁC BẢNG
-- =============================================
-- Bảng Users
CREATE TABLE USERS (
    UserId INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(200) NOT NULL,
    Email VARCHAR(100),
    Role VARCHAR(20) NOT NULL DEFAULT 'Customer',
    IsActive TINYINT DEFAULT 1,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
-- Bảng Khách hàng
CREATE TABLE KHACHHANG (
    MaKH INT PRIMARY KEY AUTO_INCREMENT,
    TenKH VARCHAR(100) NOT NULL,
    SDT VARCHAR(15) NOT NULL,
    DiaChi VARCHAR(200),
    Email VARCHAR(100),
    NgayDangKy DATETIME DEFAULT CURRENT_TIMESTAMP,
    UserId INT,
    FOREIGN KEY (UserId) REFERENCES USERS(UserId) ON DELETE SET NULL
) ENGINE=InnoDB;
-- Bảng Xe
CREATE TABLE XE (
    MaXe INT PRIMARY KEY AUTO_INCREMENT,
    BienSo VARCHAR(20) NOT NULL UNIQUE,
    HangXe VARCHAR(50),
    DoiXe INT,
    MauXe VARCHAR(30),
    MaKH INT NOT NULL,
    FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH) ON DELETE CASCADE
) ENGINE=InnoDB;
-- Bảng Dịch vụ
CREATE TABLE DICHVU (
    MaDV INT PRIMARY KEY AUTO_INCREMENT,
    TenDV VARCHAR(100) NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    MoTa VARCHAR(500),
    TrangThai TINYINT DEFAULT 1,
    HinhAnh VARCHAR(255) NULL
) ENGINE=InnoDB;
-- Bảng Yêu cầu dịch vụ
CREATE TABLE YEUCAU_DICHVU (
    MaYeuCau INT PRIMARY KEY AUTO_INCREMENT,
    TenKhachHang VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(20) NOT NULL,
    DiaChi VARCHAR(500) NOT NULL,
    MaDV INT NOT NULL,
    GhiChu VARCHAR(1000),
    NgayYeuCau DATETIME DEFAULT CURRENT_TIMESTAMP,
    TrangThai VARCHAR(20) DEFAULT 'Mới',
    NgayHen DATETIME NULL,
    GioHen VARCHAR(10) NULL,
    Username VARCHAR(50) NULL,
    FOREIGN KEY (MaDV) REFERENCES DICHVU(MaDV) ON DELETE RESTRICT
) ENGINE=InnoDB;
-- Bảng Sản phẩm
CREATE TABLE SANPHAM (
    MaSP INT PRIMARY KEY AUTO_INCREMENT,
    TenSP VARCHAR(100) NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    SoLuongTon INT DEFAULT 0,
    DonVi VARCHAR(20),
    MoTa VARCHAR(500),
    HinhAnh VARCHAR(255) NULL
) ENGINE=InnoDB;
-- Bảng Liên hệ
CREATE TABLE LIENHE (
    MaLienHe INT PRIMARY KEY AUTO_INCREMENT,
    HoTen VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(20) NOT NULL,
    ChuDe VARCHAR(100),
    NoiDung TEXT,
    NgayGui DATETIME DEFAULT CURRENT_TIMESTAMP,
    DaXuLy TINYINT DEFAULT 0,
    Username VARCHAR(50) NULL
) ENGINE=InnoDB;
-- Bảng Hóa đơn
CREATE TABLE HOADON (
    MaHD INT PRIMARY KEY AUTO_INCREMENT,
    MaKH INT NOT NULL,
    MaXe INT NULL,  -- Nullable: Đơn hàng sản phẩm không cần xe
    UserId INT NULL,  -- Nullable: Đơn hàng online không có user
    NgayLap DATETIME DEFAULT CURRENT_TIMESTAMP,
    TongTien DECIMAL(18,2) DEFAULT 0,
    HinhThucTT VARCHAR(50),
    TrangThai VARCHAR(30) DEFAULT 'Chờ xác nhận',
    FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH) ON DELETE RESTRICT,
    FOREIGN KEY (MaXe) REFERENCES XE(MaXe) ON DELETE RESTRICT,
    FOREIGN KEY (UserId) REFERENCES USERS(UserId) ON DELETE RESTRICT
) ENGINE=InnoDB;
-- Chi tiết hóa đơn - Dịch vụ
CREATE TABLE CHITIET_HDDV (
    MaCTDV INT PRIMARY KEY AUTO_INCREMENT,
    MaHD INT NOT NULL,
    MaDV INT NOT NULL,
    SoLuong INT DEFAULT 1,
    DonGia DECIMAL(18,2),
    ThanhTien DECIMAL(18,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (MaHD) REFERENCES HOADON(MaHD) ON DELETE CASCADE,
    FOREIGN KEY (MaDV) REFERENCES DICHVU(MaDV) ON DELETE RESTRICT
) ENGINE=InnoDB;
-- Chi tiết hóa đơn - Sản phẩm
CREATE TABLE CHITIET_HDSP (
    MaCTSP INT PRIMARY KEY AUTO_INCREMENT,
    MaHD INT NOT NULL,
    MaSP INT NOT NULL,
    SoLuong INT NOT NULL,
    DonGia DECIMAL(18,2),
    ThanhTien DECIMAL(18,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (MaHD) REFERENCES HOADON(MaHD) ON DELETE CASCADE,
    FOREIGN KEY (MaSP) REFERENCES SANPHAM(MaSP) ON DELETE RESTRICT
) ENGINE=InnoDB;
-- =============================================
-- TẠO INDEXES
-- =============================================
CREATE INDEX IX_USERS_Username ON USERS(Username);
CREATE INDEX IX_KHACHHANG_SDT ON KHACHHANG(SDT);
CREATE INDEX IX_XE_BIENSO ON XE(BienSo);
CREATE INDEX IX_HOADON_NGAYLAP ON HOADON(NgayLap);
-- =============================================
-- TẠO TRIGGERS
-- =============================================
-- Trigger: Cập nhật ThanhTien khi insert/update CHITIET_HDSP
DELIMITER $$
CREATE TRIGGER TRG_CHITIET_HDSP_ThanhTien_Insert
BEFORE INSERT ON CHITIET_HDSP
FOR EACH ROW
BEGIN
    SET NEW.ThanhTien = NEW.SoLuong * NEW.DonGia;
END$$
CREATE TRIGGER TRG_CHITIET_HDSP_ThanhTien_Update
BEFORE UPDATE ON CHITIET_HDSP
FOR EACH ROW
BEGIN
    SET NEW.ThanhTien = NEW.SoLuong * NEW.DonGia;
END$$
DELIMITER ;
-- Trigger: Cập nhật ThanhTien khi insert/update CHITIET_HDDV
DELIMITER $$
CREATE TRIGGER TRG_CHITIET_HDDV_ThanhTien_Insert
BEFORE INSERT ON CHITIET_HDDV
FOR EACH ROW
BEGIN
    SET NEW.ThanhTien = NEW.SoLuong * NEW.DonGia;
END$$
CREATE TRIGGER TRG_CHITIET_HDDV_ThanhTien_Update
BEFORE UPDATE ON CHITIET_HDDV
FOR EACH ROW
BEGIN
    SET NEW.ThanhTien = NEW.SoLuong * NEW.DonGia;
END$$
DELIMITER ;
-- Trigger: Cập nhật tổng tiền hóa đơn sau khi insert CHITIET_HDSP
DELIMITER $$
CREATE TRIGGER TRG_CapNhatTongTien_HDSP_Insert
AFTER INSERT ON CHITIET_HDSP
FOR EACH ROW
BEGIN
    UPDATE HOADON
    SET TongTien = (
        SELECT IFNULL(SUM(ThanhTien), 0)
        FROM CHITIET_HDSP
        WHERE MaHD = NEW.MaHD
    ) + (
        SELECT IFNULL(SUM(ThanhTien), 0)
        FROM CHITIET_HDDV
        WHERE MaHD = NEW.MaHD
    )
    WHERE MaHD = NEW.MaHD;
END$$
DELIMITER ;
-- Trigger: Cập nhật tổng tiền hóa đơn sau khi update CHITIET_HDSP
DELIMITER $$
CREATE TRIGGER TRG_CapNhatTongTien_HDSP_Update
AFTER UPDATE ON CHITIET_HDSP
FOR EACH ROW
BEGIN
    UPDATE HOADON
    SET TongTien = (
        SELECT IFNULL(SUM(ThanhTien), 0)
        FROM CHITIET_HDSP
        WHERE MaHD = NEW.MaHD
    ) + (
        SELECT IFNULL(SUM(ThanhTien), 0)
        FROM CHITIET_HDDV
        WHERE MaHD = NEW.MaHD
    )
    WHERE MaHD = NEW.MaHD;
END$$
DELIMITER ;
-- Trigger: Cập nhật tổng tiền hóa đơn sau khi delete CHITIET_HDSP
DELIMITER $$
CREATE TRIGGER TRG_CapNhatTongTien_HDSP_Delete
AFTER DELETE ON CHITIET_HDSP
FOR EACH ROW
BEGIN
    UPDATE HOADON
    SET TongTien = (
        SELECT IFNULL(SUM(ThanhTien), 0)
        FROM CHITIET_HDSP
        WHERE MaHD = OLD.MaHD
    ) + (
        SELECT IFNULL(SUM(ThanhTien), 0)
        FROM CHITIET_HDDV
        WHERE MaHD = OLD.MaHD
    )
    WHERE MaHD = OLD.MaHD;
END$$
DELIMITER ;
-- Trigger: Cập nhật tổng tiền hóa đơn sau khi insert CHITIET_HDDV
DELIMITER $$
CREATE TRIGGER TRG_CapNhatTongTien_HDDV_Insert
AFTER INSERT ON CHITIET_HDDV
FOR EACH ROW
BEGIN
    UPDATE HOADON
    SET TongTien = (
        SELECT IFNULL(SUM(ThanhTien), 0)
        FROM CHITIET_HDSP
        WHERE MaHD = NEW.MaHD
    ) + (
        SELECT IFNULL(SUM(ThanhTien), 0)
        FROM CHITIET_HDDV
        WHERE MaHD = NEW.MaHD
    )
    WHERE MaHD = NEW.MaHD;
END$$
DELIMITER ;
-- Trigger: Cập nhật tổng tiền hóa đơn sau khi update CHITIET_HDDV
DELIMITER $$
CREATE TRIGGER TRG_CapNhatTongTien_HDDV_Update
AFTER UPDATE ON CHITIET_HDDV
FOR EACH ROW
BEGIN
    UPDATE HOADON
    SET TongTien = (
        SELECT IFNULL(SUM(ThanhTien), 0)
        FROM CHITIET_HDSP
        WHERE MaHD = NEW.MaHD
    ) + (
        SELECT IFNULL(SUM(ThanhTien), 0)
        FROM CHITIET_HDDV
        WHERE MaHD = NEW.MaHD
    )
    WHERE MaHD = NEW.MaHD;
END$$
DELIMITER ;
-- Trigger: Cập nhật tổng tiền hóa đơn sau khi delete CHITIET_HDDV
DELIMITER $$
CREATE TRIGGER TRG_CapNhatTongTien_HDDV_Delete
AFTER DELETE ON CHITIET_HDDV
FOR EACH ROW
BEGIN
    UPDATE HOADON
    SET TongTien = (
        SELECT IFNULL(SUM(ThanhTien), 0)
        FROM CHITIET_HDSP
        WHERE MaHD = OLD.MaHD
    ) + (
        SELECT IFNULL(SUM(ThanhTien), 0)
        FROM CHITIET_HDDV
        WHERE MaHD = OLD.MaHD
    )
    WHERE MaHD = OLD.MaHD;
END$$
DELIMITER ;
-- Trigger: Kiểm tra và cập nhật tồn kho khi insert CHITIET_HDSP
DELIMITER $$
CREATE TRIGGER TRG_CapNhatTonKho_Insert
BEFORE INSERT ON CHITIET_HDSP
FOR EACH ROW
BEGIN
    DECLARE v_SoLuongTon INT;
   
    SELECT SoLuongTon INTO v_SoLuongTon
    FROM SANPHAM
    WHERE MaSP = NEW.MaSP;
   
    IF v_SoLuongTon < NEW.SoLuong THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Số lượng tồn không đủ!';
    END IF;
   
    UPDATE SANPHAM
    SET SoLuongTon = SoLuongTon - NEW.SoLuong
    WHERE MaSP = NEW.MaSP;
END$$
DELIMITER ;
-- Trigger: Kiểm tra và cập nhật tồn kho khi update CHITIET_HDSP
DELIMITER $$
CREATE TRIGGER TRG_CapNhatTonKho_Update
BEFORE UPDATE ON CHITIET_HDSP
FOR EACH ROW
BEGIN
    DECLARE v_SoLuongTon INT;
    DECLARE v_ChenhLech INT;
   
    SET v_ChenhLech = NEW.SoLuong - OLD.SoLuong;
   
    IF v_ChenhLech != 0 THEN
        SELECT SoLuongTon INTO v_SoLuongTon
        FROM SANPHAM
        WHERE MaSP = NEW.MaSP;
       
        IF v_SoLuongTon < v_ChenhLech THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Số lượng tồn không đủ!';
        END IF;
       
        UPDATE SANPHAM
        SET SoLuongTon = SoLuongTon - v_ChenhLech
        WHERE MaSP = NEW.MaSP;
    END IF;
END$$
DELIMITER ;
-- =============================================
-- TẠO STORED PROCEDURES
-- =============================================
-- Procedure: Đăng ký khách hàng
DELIMITER $$
CREATE PROCEDURE sp_DangKyKhachHang(
    IN p_Username VARCHAR(50),
    IN p_Password VARCHAR(200),
    IN p_Email VARCHAR(100),
    IN p_HoTen VARCHAR(100),
    IN p_SDT VARCHAR(15),
    IN p_DiaChi VARCHAR(200)
)
BEGIN
    DECLARE v_UserId INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error' AS Result, 'Đăng ký thất bại!' AS Message;
    END;
   
    START TRANSACTION;
   
    INSERT INTO USERS (Username, Password, Email, Role)
    VALUES (p_Username, p_Password, p_Email, 'Customer');
   
    SET v_UserId = LAST_INSERT_ID();
   
    INSERT INTO KHACHHANG (TenKH, SDT, DiaChi, Email, UserId)
    VALUES (p_HoTen, p_SDT, p_DiaChi, p_Email, v_UserId);
   
    COMMIT;
    SELECT 'Success' AS Result, 'Đăng ký thành công!' AS Message;
END$$
DELIMITER ;
-- Procedure: Đăng nhập
DELIMITER $$
CREATE PROCEDURE sp_DangNhap(
    IN p_Username VARCHAR(50),
    IN p_Password VARCHAR(200)
)
BEGIN
    SELECT
        u.UserId,
        u.Username,
        u.Email,
        u.Role,
        k.MaKH,
        k.TenKH
    FROM USERS u
    LEFT JOIN KHACHHANG k ON u.UserId = k.UserId
    WHERE u.Username = p_Username
    AND u.Password = p_Password
    AND u.IsActive = 1;
END$$
DELIMITER ;
-- =============================================
-- THÊM DỮ LIỆU MẪU
-- =============================================
-- Admin user (password: 123456 hashed with SHA256)
INSERT INTO USERS (Username, Password, Email, Role, IsActive) VALUES
('admin', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'admin@gara.com', 'Admin', 1),
('admin2', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'admin2@gara.com', 'Admin', 1),
('nhanvien1', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'nv1@gara.com', 'Admin', 1);
-- Customer users (password: 123456 hashed with SHA256)
INSERT INTO USERS (Username, Password, Email, Role, IsActive) VALUES
('customer1', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'customer1@gmail.com', 'Customer', 1),
('customer2', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'customer2@gmail.com', 'Customer', 1),
('khach3', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'khach3@gmail.com', 'Customer', 1),
('khach4', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'khach4@gmail.com', 'Customer', 1),
('khach5', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'khach5@gmail.com', 'Customer', 1),
('khach6', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'khach6@gmail.com', 'Customer', 1),
('khach7', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'khach7@gmail.com', 'Customer', 1),
('khach8', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'khach8@gmail.com', 'Customer', 0);
-- Khách hàng
INSERT INTO KHACHHANG (TenKH, SDT, DiaChi, Email, UserId) VALUES
('Nguyễn Văn Anh', '0901234567', 'Hà Nội', 'customer1@gmail.com', 4),
('Trần Thị Bê', '0912345678', 'TP.HCM', 'customer2@gmail.com', 5),
('Lê Văn Chung', '0923456789', '123 Nguyễn Trãi, Thanh Xuân, Hà Nội', 'khach3@gmail.com', 6),
('Phạm Thị Duyên', '0934567890', '456 Lê Lợi, Quận 1, TP.HCM', 'khach4@gmail.com', 7),
('Hoàng Văn Em', '0945678901', '789 Trần Phú, Hải Châu, Đà Nẵng', 'khach5@gmail.com', 8),
('Ngô Thị Bắp', '0956789012', '321 Hùng Vương, Ninh Kiều, Cần Thơ', 'khach6@gmail.com', 9),
('Đặng Văn Giàu', '0967890123', '654 Lý Thường Kiệt, Hồng Bàng, Hải Phòng', 'khach7@gmail.com', 10),
('Vũ Thị Hương', '0978901234', '987 Nguyễn Huệ, Quận 3, TP.HCM', 'khach8@gmail.com', 11),
('Bùi Văn Huấn', '0989012345', '147 Điện Biên Phủ, Ba Đình, Hà Nội', NULL, NULL),
('Trịnh Thị Khanh', '0990123456', '258 Võ Văn Tần, Quận 10, TP.HCM', NULL, NULL);
-- Xe
INSERT INTO XE (BienSo, HangXe, DoiXe, MauXe, MaKH) VALUES
('30A-12345', 'Toyota', 2020, 'Trắng', 1),
('51B-67890', 'Honda', 2019, 'Đen', 2),
('29A-11111', 'Toyota Camry', 2022, 'Đen', 3),
('30B-22222', 'Honda Civic', 2021, 'Trắng', 3),
('51C-33333', 'Mazda CX-5', 2023, 'Đỏ', 4),
('43D-44444', 'Hyundai Tucson', 2020, 'Xám', 5),
('92E-55555', 'Kia Seltos', 2022, 'Xanh', 6),
('65F-66666', 'Ford Ranger', 2021, 'Bạc', 7),
('15G-77777', 'VinFast VF8', 2023, 'Xanh Navy', 8),
('29H-88888', 'Mercedes C200', 2022, 'Đen', 9),
('30K-99999', 'BMW 320i', 2021, 'Trắng', 10),
('51L-00000', 'Audi A4', 2020, 'Xám', 3),
('KHONGCO', 'Không có', NULL, 'Không có', 1);
-- Dịch vụ
INSERT INTO DICHVU (TenDV, DonGia, MoTa, HinhAnh, TrangThai) VALUES
('Thay dầu động cơ', 1500000, 'Thay dầu nhớt động cơ và lọc dầu cho ô tô', 'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg', 1),
('Rửa xe', 150000, 'Rửa xe và hút bụi nội thất cơ bản cho ô tô', 'https://images.pexels.com/photos/6872156/pexels-photo-6872156.jpeg', 1),
('Bảo dưỡng định kỳ', 1500000, 'Kiểm tra tổng quát và thay thế phụ tùng hao mòn theo km', 'https://images.pexels.com/photos/8986070/pexels-photo-8986070.jpeg', 1),
('Vá lốp/Cân mâm', 300000, 'Vá lốp, cân bằng động bánh xe ô tô', 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg', 1),
('Vệ sinh nội thất', 1200000, 'Làm sạch nội thất xe ô tô chuyên sâu', 'https://images.pexels.com/photos/6873185/pexels-photo-6873185.jpeg', 1),
('Đánh bóng/Hiệu chỉnh sơn', 2500000, 'Xử lý các vết xước và hiệu chỉnh sơn mới', 'https://images.pexels.com/photos/6026083/pexels-photo-6026083.jpeg', 1),
('Thay ắc quy', 800000, 'Kiểm tra và thay thế ắc quy cho xe', 'https://images.pexels.com/photos/5572265/pexels-photo-5572265.jpeg', 1),
('Sửa chữa phanh', 750000, 'Kiểm tra, thay má phanh, tiện đĩa phanh', 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg', 1),
('Vệ sinh khoang máy', 500000, 'Làm sạch dầu mỡ và bụi bẩn trong khoang động cơ', 'https://images.pexels.com/photos/8478224/pexels-photo-8478224.jpeg', 1),
('Kiểm tra điện - điện tử', 350000, 'Kiểm tra hệ thống điện, cảm biến, ECU', 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg', 1),
('Thay dầu hộp số', 800000, 'Thay dầu hộp số tự động/số sàn', 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg', 1),
('Nạp ga điều hòa', 450000, 'Kiểm tra và nạp gas điều hòa ô tô', 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg', 1),
('Cứu hộ xe', 500000, 'Dịch vụ cứu hộ xe trong bán kính 20km', 'https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg', 1),
('Dịch vụ ngừng cung cấp', 999000, 'Dịch vụ test đã ngừng', NULL, 0);
-- Sản phẩm
INSERT INTO SANPHAM (TenSP, DonGia, SoLuongTon, DonVi, MoTa, HinhAnh) VALUES
('Dầu nhớt Shell 5W30', 250000, 50, 'Chai', 'Dầu tổng hợp, dùng cho động cơ xăng.', 'https://cdn2.fptshop.com.vn/unsafe/800x0/Castrol_5_W30_3_2bc030e832.jpg'),
('Lọc gió động cơ', 80000, 100, 'Cái', 'Lọc bụi bẩn, kéo dài tuổi thọ động cơ.', 'https://otohoangkim-storage.sgp1.cdn.digitaloceanspaces.com/loc-gio-dong-co.webp'),
('Bóng đèn LED', 150000, 30, 'Bộ', 'Đèn pha LED độ sáng cao.', 'https://images.pexels.com/photos/2127020/pexels-photo-2127020.jpeg'),
('Nước làm mát 4L', 180000, 40, 'Can', 'Dung dịch tản nhiệt, chống đông.', 'https://danchoioto.vn/wp-content/uploads/2021/05/buoc-3-thay-nuoc-lam-mat-moi.jpeg.webp'),
('Má phanh trước', 650000, 25, 'Bộ', 'Má phanh gốm, hiệu suất phanh tốt.', 'https://images.pexels.com/photos/248370/pexels-photo-248370.jpeg'),
('Bugi động cơ', 120000, 60, 'Cái', 'Bugi đánh lửa Iridium.', 'https://ranone.vn/wp-content/uploads/2024/07/bugi-4-cay.jpg'),
('Lọc dầu', 100000, 80, 'Cái', 'Lọc cặn bẩn trong dầu.', 'https://danchoioto.vn/wp-content/uploads/2021/03/loc-dau-o-to-3.jpg.webp'),
('Dung dịch rửa kính', 50000, 120, 'Chai', 'Làm sạch kính chắn gió.', 'https://images.pexels.com/photos/6872603/pexels-photo-6872603.jpeg'),
('Lốp xe ô tô R16', 1800000, 15, 'Cái', 'Lốp xe du lịch, 205/55 R16.', 'https://images.pexels.com/photos/6870331/pexels-photo-6870331.jpeg'),
('Dầu hộp số ATF', 350000, 30, 'Lít', 'Dầu hộp số tự động cao cấp', 'https://images.pexels.com/photos/4489765/pexels-photo-4489765.jpeg'),
('Gas điều hòa R134a', 200000, 50, 'Bình', 'Gas lạnh cho điều hòa ô tô', 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg'),
('Gạt mưa Bosch', 280000, 40, 'Bộ', 'Gạt mưa cao cấp Bosch', 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg'),
('Bình ắc quy 12V 60Ah', 1500000, 10, 'Bình', 'Ắc quy khởi động cho xe hơi', 'https://images.pexels.com/photos/5572265/pexels-photo-5572265.jpeg'),
('Sản phẩm hết hàng', 100000, 0, 'Cái', 'Sản phẩm test hết hàng', NULL);
-- Yêu cầu dịch vụ
INSERT INTO YEUCAU_DICHVU (TenKhachHang, SoDienThoai, DiaChi, MaDV, GhiChu, NgayYeuCau, TrangThai, NgayHen, GioHen) VALUES
('Nguyễn Văn An', '0901234567', 'Hà Nội', 1, 'Xe chạy được 10,000km, cần thay dầu', DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), 'Hoàn thành', DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '09:00'),
('Trần Thị Bình', '0912345678', 'TP.HCM', 2, 'Rửa xe và hút bụi', DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), 'Hoàn thành', DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '14:00'),
('Lê Văn Chiến', '0923456789', 'Hà Nội', 3, 'Bảo dưỡng định kỳ 20,000km', DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), 'Đang xử lý', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '10:00'),
('Phạm Thị Duyên', '0934567890', 'TP.HCM', 4, 'Lốp bị xì hơi', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), 'Đang xử lý', CURRENT_DATE(), '08:30'),
('Hoàng Văn Em', '0945678901', 'Đà Nẵng', 5, 'Vệ sinh nội thất toàn bộ', CURRENT_DATE(), 'Mới', DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '15:00'),
('Ngô Thị Lúa', '0956789012', 'Cần Thơ', 6, 'Xe bị xước nhẹ cần đánh bóng', CURRENT_DATE(), 'Mới', DATE_ADD(CURRENT_DATE(), INTERVAL 2 DAY), '09:30'),
('Đặng Văn Tài', '0967890123', 'Hải Phòng', 7, 'Ắc quy yếu, khó khởi động', CURRENT_DATE(), 'Mới', DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '11:00'),
('Vũ Thị Hương', '0978901234', 'TP.HCM', 8, 'Phanh kêu khi đạp', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY), 'Đã hủy', NULL, NULL),
('Bùi Văn Huấn', '0989012345', 'Hà Nội', 9, 'Khoang máy bẩn', DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), 'Hoàn thành', DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), '16:00'),
('Trịnh Thị Kim', '0990123456', 'TP.HCM', 1, 'Thay dầu định kỳ', DATE_SUB(CURRENT_DATE(), INTERVAL 10 DAY), 'Hoàn thành', DATE_SUB(CURRENT_DATE(), INTERVAL 9 DAY), '10:30'),
('Khách vãng lai 1', '0911111111', 'Quận 7, TP.HCM', 2, 'Rửa xe nhanh', CURRENT_DATE(), 'Mới', DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '13:00'),
('Khách vãng lai 2', '0922222222', 'Cầu Giấy, Hà Nội', 3, 'Kiểm tra tổng quát xe', CURRENT_DATE(), 'Mới', DATE_ADD(CURRENT_DATE(), INTERVAL 3 DAY), '08:00');
-- Liên hệ
INSERT INTO LIENHE (HoTen, Email, SoDienThoai, ChuDe, NoiDung, DaXuLy) VALUES
('Nguyễn Văn A', 'a@gmail.com', '0901234567', 'Tư vấn dịch vụ', 'Muốn tư vấn thay dầu', 1),
('Trần Thị B', 'b@gmail.com', '0912345678', 'Phàn nàn', 'Xe sửa chưa tốt', 0),
('Lê Văn C', 'c@gmail.com', '0923456789', 'Hỏi giá', 'Giá bảo dưỡng bao nhiêu?', 1),
('Phạm Thị D', 'd@gmail.com', '0934567890', 'Đặt lịch', 'Đặt lịch rửa xe', 0),
('Hoàng Văn E', 'e@gmail.com', '0945678901', 'Khác', 'Gợi ý cải thiện', 1),
('Ngô Thị F', 'f@gmail.com', '0956789012', 'Tư vấn sản phẩm', 'Mua lọc dầu', 0),
('Đặng Văn G', 'g@gmail.com', '0967890123', 'Phàn nàn', 'Dịch vụ chậm', 1),
('Vũ Thị H', 'h@gmail.com', '0978901234', 'Hỏi giá', 'Giá thay ắc quy?', 0),
('Bùi Văn I', 'i@gmail.com', '0989012345', 'Tư vấn dịch vụ', 'Vệ sinh nội thất', 1),
('Trịnh Thị J', 'j@gmail.com', '0990123456', 'Đặt lịch', 'Đặt lịch bảo dưỡng', 0);
-- Hóa đơn
INSERT INTO HOADON (MaKH, MaXe, UserId, NgayLap, TongTien, HinhThucTT, TrangThai) VALUES
(1, 1, 1, DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), 4100000, 'Tiền mặt', 'Hoàn thành'),
(2, 2, 1, DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), 1590000, 'Chuyển khoản', 'Hoàn thành'),
(3, 3, 1, DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), 700000, 'Thẻ', 'Đang xử lý'),
(4, 4, 1, DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), 2500000, NULL, 'Đang xử lý'),
(5, 5, 1, CURRENT_DATE(), 800000, NULL, 'Chờ xác nhận'),
(6, 6, 1, CURRENT_DATE(), 1250000, NULL, 'Chờ xác nhận'),
(7, 7, 1, DATE_SUB(CURRENT_DATE(), INTERVAL 10 DAY), 2650000, 'Tiền mặt', 'Hoàn thành'),
(8, 8, 1, DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY), 950000, NULL, 'Đang xử lý'),
(9, 9, 1, DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), 1400000, NULL, 'Đang xử lý'),
(10, 10, 1, CURRENT_DATE(), 3030000, NULL, 'Đang xử lý'),
(3, 13, 1, CURRENT_DATE(), 1350000, NULL, 'Chờ xác nhận'),
(4, 13, 1, DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), 1500000, 'Chuyển khoản', 'Hoàn thành'),
(5, 5, 1, CURRENT_DATE(), 1200000, NULL, 'Chờ xác nhận');
-- Chi tiết hóa đơn - Dịch vụ
INSERT INTO CHITIET_HDDV (MaHD, MaDV, SoLuong, DonGia, ThanhTien) VALUES
(1, 1, 1, 1500000, 1500000),
(1, 3, 1, 1500000, 1500000),
(2, 2, 1, 150000, 150000),
(2, 5, 1, 1200000, 1200000),
(3, 4, 2, 300000, 600000),
(4, 6, 1, 2500000, 2500000),
(5, 7, 1, 800000, 800000),
(6, 8, 1, 750000, 750000),
(6, 9, 1, 500000, 500000),
(7, 3, 1, 1500000, 1500000),
(7, 2, 1, 150000, 150000),
(8, 7, 1, 800000, 800000),
(8, 2, 1, 150000, 150000),
(9, 8, 1, 750000, 750000),
(10, 3, 1, 1500000, 1500000),
(10, 1, 1, 1500000, 1500000),
(11, 2, 1, 150000, 150000),
(11, 5, 1, 1200000, 1200000),
(12, 1, 1, 1500000, 1500000),
(13, 4, 4, 300000, 1200000);
-- Chi tiết hóa đơn - Sản phẩm
INSERT INTO CHITIET_HDSP (MaHD, MaSP, SoLuong, DonGia, ThanhTien) VALUES
(1, 1, 4, 250000, 1000000),
(1, 7, 1, 100000, 100000),
(2, 2, 1, 80000, 80000),
(2, 6, 4, 120000, 480000),
(2, 4, 1, 180000, 180000),
(3, 8, 2, 50000, 100000),
(7, 1, 4, 250000, 1000000),
(7, 7, 1, 100000, 100000),
(9, 5, 1, 650000, 650000),
(10, 1, 5, 250000, 1250000),
(10, 7, 1, 100000, 100000),
(10, 2, 1, 80000, 80000);
-- =============================================
-- THỐNG KÊ DỮ LIỆU
-- =============================================
SELECT 'USERS' AS Bảng, COUNT(*) AS Số_lượng FROM USERS
UNION ALL
SELECT 'KHACHHANG', COUNT(*) FROM KHACHHANG
UNION ALL
SELECT 'XE', COUNT(*) FROM XE
UNION ALL
SELECT 'DICHVU', COUNT(*) FROM DICHVU
UNION ALL
SELECT 'SANPHAM', COUNT(*) FROM SANPHAM
UNION ALL
SELECT 'YEUCAU_DICHVU', COUNT(*) FROM YEUCAU_DICHVU
UNION ALL
SELECT 'LIENHE', COUNT(*) FROM LIENHE
UNION ALL
SELECT 'HOADON', COUNT(*) FROM HOADON
UNION ALL
SELECT 'CHITIET_HDDV', COUNT(*) FROM CHITIET_HDDV
UNION ALL
SELECT 'CHITIET_HDSP', COUNT(*) FROM CHITIET_HDSP;
-- =============================================
-- HOÀN TẤT
-- =============================================