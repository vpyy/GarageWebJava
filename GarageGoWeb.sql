-- =============================================
-- QUẢN LÝ GARA Ô TÔ - MYSQL VERSION
-- =============================================

DROP DATABASE IF EXISTS GaraOToManagement;
CREATE DATABASE GaraOToManagement CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE GaraOToManagement;

-- =============================================
-- TẠO CÁC BẢNG
-- =============================================

CREATE TABLE USERS (
    UserId INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(200) NOT NULL,
    Email VARCHAR(100),
    Role VARCHAR(20) NOT NULL DEFAULT 'Customer',
    IsActive TINYINT DEFAULT 1,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

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

CREATE TABLE XE (
    MaXe INT PRIMARY KEY AUTO_INCREMENT,
    BienSo VARCHAR(20) NOT NULL UNIQUE,
    HangXe VARCHAR(50),
    DoiXe INT,
    MauXe VARCHAR(30),
    MaKH INT NOT NULL,
    FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE DICHVU (
    MaDV INT PRIMARY KEY AUTO_INCREMENT,
    TenDV VARCHAR(100) NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    MoTa VARCHAR(500),
    TrangThai TINYINT DEFAULT 1,
    HinhAnh VARCHAR(255) NULL
) ENGINE=InnoDB;

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

CREATE TABLE SANPHAM (
    MaSP INT PRIMARY KEY AUTO_INCREMENT,
    TenSP VARCHAR(100) NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    SoLuongTon INT DEFAULT 0,
    DonVi VARCHAR(20),
    MoTa VARCHAR(500),
    HinhAnh VARCHAR(255) NULL
) ENGINE=InnoDB;

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

CREATE TABLE HOADON (
    MaHD INT PRIMARY KEY AUTO_INCREMENT,
    MaKH INT NOT NULL,
    MaXe INT NULL,
    UserId INT NULL,
    NgayLap DATETIME DEFAULT CURRENT_TIMESTAMP,
    TongTien DECIMAL(18,2) DEFAULT 0,
    HinhThucTT VARCHAR(50),
    TrangThai VARCHAR(30) DEFAULT 'Chờ xác nhận',
    FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH) ON DELETE RESTRICT,
    FOREIGN KEY (MaXe) REFERENCES XE(MaXe) ON DELETE RESTRICT,
    FOREIGN KEY (UserId) REFERENCES USERS(UserId) ON DELETE RESTRICT
) ENGINE=InnoDB;

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
-- INDEXES
-- =============================================

CREATE INDEX IX_USERS_Username ON USERS(Username);
CREATE INDEX IX_KHACHHANG_SDT ON KHACHHANG(SDT);
CREATE INDEX IX_XE_BIENSO ON XE(BienSo);
CREATE INDEX IX_HOADON_NGAYLAP ON HOADON(NgayLap);

-- =============================================
-- TRIGGERS
-- =============================================

DELIMITER $$
CREATE TRIGGER TRG_CHITIET_HDSP_ThanhTien_Insert
BEFORE INSERT ON CHITIET_HDSP FOR EACH ROW
BEGIN SET NEW.ThanhTien = NEW.SoLuong * NEW.DonGia; END$$

CREATE TRIGGER TRG_CHITIET_HDSP_ThanhTien_Update
BEFORE UPDATE ON CHITIET_HDSP FOR EACH ROW
BEGIN SET NEW.ThanhTien = NEW.SoLuong * NEW.DonGia; END$$

CREATE TRIGGER TRG_CHITIET_HDDV_ThanhTien_Insert
BEFORE INSERT ON CHITIET_HDDV FOR EACH ROW
BEGIN SET NEW.ThanhTien = NEW.SoLuong * NEW.DonGia; END$$

CREATE TRIGGER TRG_CHITIET_HDDV_ThanhTien_Update
BEFORE UPDATE ON CHITIET_HDDV FOR EACH ROW
BEGIN SET NEW.ThanhTien = NEW.SoLuong * NEW.DonGia; END$$

CREATE TRIGGER TRG_CapNhatTongTien_HDSP_Insert
AFTER INSERT ON CHITIET_HDSP FOR EACH ROW
BEGIN
    UPDATE HOADON SET TongTien = (
        SELECT IFNULL(SUM(ThanhTien),0) FROM CHITIET_HDSP WHERE MaHD = NEW.MaHD
    ) + (
        SELECT IFNULL(SUM(ThanhTien),0) FROM CHITIET_HDDV WHERE MaHD = NEW.MaHD
    ) WHERE MaHD = NEW.MaHD;
END$$

CREATE TRIGGER TRG_CapNhatTongTien_HDSP_Update
AFTER UPDATE ON CHITIET_HDSP FOR EACH ROW
BEGIN
    UPDATE HOADON SET TongTien = (
        SELECT IFNULL(SUM(ThanhTien),0) FROM CHITIET_HDSP WHERE MaHD = NEW.MaHD
    ) + (
        SELECT IFNULL(SUM(ThanhTien),0) FROM CHITIET_HDDV WHERE MaHD = NEW.MaHD
    ) WHERE MaHD = NEW.MaHD;
END$$

CREATE TRIGGER TRG_CapNhatTongTien_HDSP_Delete
AFTER DELETE ON CHITIET_HDSP FOR EACH ROW
BEGIN
    UPDATE HOADON SET TongTien = (
        SELECT IFNULL(SUM(ThanhTien),0) FROM CHITIET_HDSP WHERE MaHD = OLD.MaHD
    ) + (
        SELECT IFNULL(SUM(ThanhTien),0) FROM CHITIET_HDDV WHERE MaHD = OLD.MaHD
    ) WHERE MaHD = OLD.MaHD;
END$$

CREATE TRIGGER TRG_CapNhatTongTien_HDDV_Insert
AFTER INSERT ON CHITIET_HDDV FOR EACH ROW
BEGIN
    UPDATE HOADON SET TongTien = (
        SELECT IFNULL(SUM(ThanhTien),0) FROM CHITIET_HDSP WHERE MaHD = NEW.MaHD
    ) + (
        SELECT IFNULL(SUM(ThanhTien),0) FROM CHITIET_HDDV WHERE MaHD = NEW.MaHD
    ) WHERE MaHD = NEW.MaHD;
END$$

CREATE TRIGGER TRG_CapNhatTongTien_HDDV_Update
AFTER UPDATE ON CHITIET_HDDV FOR EACH ROW
BEGIN
    UPDATE HOADON SET TongTien = (
        SELECT IFNULL(SUM(ThanhTien),0) FROM CHITIET_HDSP WHERE MaHD = NEW.MaHD
    ) + (
        SELECT IFNULL(SUM(ThanhTien),0) FROM CHITIET_HDDV WHERE MaHD = NEW.MaHD
    ) WHERE MaHD = NEW.MaHD;
END$$

CREATE TRIGGER TRG_CapNhatTongTien_HDDV_Delete
AFTER DELETE ON CHITIET_HDDV FOR EACH ROW
BEGIN
    UPDATE HOADON SET TongTien = (
        SELECT IFNULL(SUM(ThanhTien),0) FROM CHITIET_HDSP WHERE MaHD = OLD.MaHD
    ) + (
        SELECT IFNULL(SUM(ThanhTien),0) FROM CHITIET_HDDV WHERE MaHD = OLD.MaHD
    ) WHERE MaHD = OLD.MaHD;
END$$

CREATE TRIGGER TRG_CapNhatTonKho_Insert
BEFORE INSERT ON CHITIET_HDSP FOR EACH ROW
BEGIN
    DECLARE v_SoLuongTon INT;
    SELECT SoLuongTon INTO v_SoLuongTon FROM SANPHAM WHERE MaSP = NEW.MaSP;
    IF v_SoLuongTon < NEW.SoLuong THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số lượng tồn không đủ!';
    END IF;
    UPDATE SANPHAM SET SoLuongTon = SoLuongTon - NEW.SoLuong WHERE MaSP = NEW.MaSP;
END$$

CREATE TRIGGER TRG_CapNhatTonKho_Update
BEFORE UPDATE ON CHITIET_HDSP FOR EACH ROW
BEGIN
    DECLARE v_SoLuongTon INT;
    DECLARE v_ChenhLech INT;
    SET v_ChenhLech = NEW.SoLuong - OLD.SoLuong;
    IF v_ChenhLech != 0 THEN
        SELECT SoLuongTon INTO v_SoLuongTon FROM SANPHAM WHERE MaSP = NEW.MaSP;
        IF v_SoLuongTon < v_ChenhLech THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số lượng tồn không đủ!';
        END IF;
        UPDATE SANPHAM SET SoLuongTon = SoLuongTon - v_ChenhLech WHERE MaSP = NEW.MaSP;
    END IF;
END$$
DELIMITER ;

-- =============================================
-- STORED PROCEDURES
-- =============================================

DELIMITER $$
CREATE PROCEDURE sp_DangKyKhachHang(
    IN p_Username VARCHAR(50), IN p_Password VARCHAR(200), IN p_Email VARCHAR(100),
    IN p_HoTen VARCHAR(100), IN p_SDT VARCHAR(15), IN p_DiaChi VARCHAR(200)
)
BEGIN
    DECLARE v_UserId INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; SELECT 'Error' AS Result, 'Đăng ký thất bại!' AS Message; END;
    START TRANSACTION;
    INSERT INTO USERS (Username, Password, Email, Role) VALUES (p_Username, p_Password, p_Email, 'Customer');
    SET v_UserId = LAST_INSERT_ID();
    INSERT INTO KHACHHANG (TenKH, SDT, DiaChi, Email, UserId) VALUES (p_HoTen, p_SDT, p_DiaChi, p_Email, v_UserId);
    COMMIT;
    SELECT 'Success' AS Result, 'Đăng ký thành công!' AS Message;
END$$

CREATE PROCEDURE sp_DangNhap(IN p_Username VARCHAR(50), IN p_Password VARCHAR(200))
BEGIN
    SELECT u.UserId, u.Username, u.Email, u.Role, k.MaKH, k.TenKH
    FROM USERS u LEFT JOIN KHACHHANG k ON u.UserId = k.UserId
    WHERE u.Username = p_Username AND u.Password = p_Password AND u.IsActive = 1;
END$$
DELIMITER ;

-- =============================================
-- DỮ LIỆU MẪU
-- Password: 123456 — BCrypt hash (strength=10):
-- $2a$10$XGChlyDfMqFEKi9.6hnDCu.xTwylMiuwLNa13zvhCCCzitg8oRE6e
-- =============================================

INSERT INTO USERS (Username, Password, Email, Role, IsActive) VALUES
('admin',    '$2a$10$XGChlyDfMqFEKi9.6hnDCu.xTwylMiuwLNa13zvhCCCzitg8oRE6e', 'admin@gara.com',    'Admin',    1),
('customer', '$2a$10$XGChlyDfMqFEKi9.6hnDCu.xTwylMiuwLNa13zvhCCCzitg8oRE6e', 'customer@gmail.com','Customer', 1);

INSERT INTO KHACHHANG (TenKH, SDT, DiaChi, Email, UserId) VALUES
('Khách Hàng Mẫu', '0901234567', 'Hà Nội', 'customer@gmail.com', 2);

INSERT INTO XE (BienSo, HangXe, DoiXe, MauXe, MaKH) VALUES
('30A-12345', 'Toyota Camry', 2022, 'Trắng', 1),
('51B-67890', 'Honda Civic',  2021, 'Đen',   1);

INSERT INTO DICHVU (TenDV, DonGia, MoTa, HinhAnh, TrangThai) VALUES
('Thay dầu động cơ',       1500000, 'Thay dầu nhớt động cơ và lọc dầu cho ô tô',              'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg', 1),
('Rửa xe',                  150000, 'Rửa xe và hút bụi nội thất cơ bản cho ô tô',              'https://images.pexels.com/photos/6872156/pexels-photo-6872156.jpeg',  1),
('Bảo dưỡng định kỳ',      1500000, 'Kiểm tra tổng quát và thay thế phụ tùng hao mòn theo km', 'https://images.pexels.com/photos/8986070/pexels-photo-8986070.jpeg',  1),
('Vá lốp/Cân mâm',          300000, 'Vá lốp, cân bằng động bánh xe ô tô',                      'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg',  1),
('Vệ sinh nội thất',        1200000, 'Làm sạch nội thất xe ô tô chuyên sâu',                    'https://images.pexels.com/photos/6873185/pexels-photo-6873185.jpeg',  1),
('Đánh bóng/Hiệu chỉnh sơn',2500000,'Xử lý các vết xước và hiệu chỉnh sơn mới',               'https://images.pexels.com/photos/6026083/pexels-photo-6026083.jpeg',  1),
('Thay ắc quy',              800000, 'Kiểm tra và thay thế ắc quy cho xe',                      'https://images.pexels.com/photos/5572265/pexels-photo-5572265.jpeg',  1),
('Sửa chữa phanh',           750000, 'Kiểm tra, thay má phanh, tiện đĩa phanh',                 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg',  1),
('Vệ sinh khoang máy',       500000, 'Làm sạch dầu mỡ và bụi bẩn trong khoang động cơ',        'https://images.pexels.com/photos/8478224/pexels-photo-8478224.jpeg',  1),
('Kiểm tra điện - điện tử',  350000, 'Kiểm tra hệ thống điện, cảm biến, ECU',                   'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg',  1),
('Thay dầu hộp số',          800000, 'Thay dầu hộp số tự động/số sàn',                          'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg',  1),
('Nạp ga điều hòa',          450000, 'Kiểm tra và nạp gas điều hòa ô tô',                       'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg',  1),
('Cứu hộ xe',                500000, 'Dịch vụ cứu hộ xe trong bán kính 20km',                   'https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg',      1);

INSERT INTO SANPHAM (TenSP, DonGia, SoLuongTon, DonVi, MoTa, HinhAnh) VALUES
('Dầu nhớt Shell 5W30',  250000,  50, 'Chai', 'Dầu tổng hợp, dùng cho động cơ xăng.',       'https://cdn2.fptshop.com.vn/unsafe/800x0/Castrol_5_W30_3_2bc030e832.jpg'),
('Lọc gió động cơ',       80000, 100, 'Cái',  'Lọc bụi bẩn, kéo dài tuổi thọ động cơ.',    'https://otohoangkim-storage.sgp1.cdn.digitaloceanspaces.com/loc-gio-dong-co.webp'),
('Bóng đèn LED',         150000,  30, 'Bộ',   'Đèn pha LED độ sáng cao.',                   'https://images.pexels.com/photos/2127020/pexels-photo-2127020.jpeg'),
('Nước làm mát 4L',      180000,  40, 'Can',  'Dung dịch tản nhiệt, chống đông.',            'https://danchoioto.vn/wp-content/uploads/2021/05/buoc-3-thay-nuoc-lam-mat-moi.jpeg.webp'),
('Má phanh trước',       650000,  25, 'Bộ',   'Má phanh gốm, hiệu suất phanh tốt.',         'https://images.pexels.com/photos/248370/pexels-photo-248370.jpeg'),
('Bugi động cơ',         120000,  60, 'Cái',  'Bugi đánh lửa Iridium.',                     'https://ranone.vn/wp-content/uploads/2024/07/bugi-4-cay.jpg'),
('Lọc dầu',              100000,  80, 'Cái',  'Lọc cặn bẩn trong dầu.',                     'https://danchoioto.vn/wp-content/uploads/2021/03/loc-dau-o-to-3.jpg.webp'),
('Dung dịch rửa kính',    50000, 120, 'Chai', 'Làm sạch kính chắn gió.',                    'https://images.pexels.com/photos/6872603/pexels-photo-6872603.jpeg'),
('Lốp xe ô tô R16',     1800000,  15, 'Cái',  'Lốp xe du lịch, 205/55 R16.',                'https://images.pexels.com/photos/6870331/pexels-photo-6870331.jpeg'),
('Dầu hộp số ATF',       350000,  30, 'Lít',  'Dầu hộp số tự động cao cấp.',                'https://images.pexels.com/photos/4489765/pexels-photo-4489765.jpeg'),
('Gas điều hòa R134a',   200000,  50, 'Bình', 'Gas lạnh cho điều hòa ô tô.',                'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg'),
('Gạt mưa Bosch',        280000,  40, 'Bộ',   'Gạt mưa cao cấp Bosch.',                     'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg'),
('Bình ắc quy 12V 60Ah',1500000,  10, 'Bình', 'Ắc quy khởi động cho xe hơi.',               'https://images.pexels.com/photos/5572265/pexels-photo-5572265.jpeg');

INSERT INTO YEUCAU_DICHVU (TenKhachHang, SoDienThoai, DiaChi, MaDV, GhiChu, NgayYeuCau, TrangThai, NgayHen, GioHen, Username) VALUES
('Khách Hàng Mẫu', '0901234567', 'Hà Nội', 1, 'Xe chạy được 10,000km, cần thay dầu', DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), 'Hoàn thành', DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '09:00', 'customer'),
('Khách Hàng Mẫu', '0901234567', 'Hà Nội', 2, 'Rửa xe và hút bụi',                   DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), 'Đang xử lý', CURRENT_DATE(),                              '14:00', 'customer'),
('Khách vãng lai', '0911111111', 'TP.HCM', 3, 'Bảo dưỡng định kỳ 20,000km',          CURRENT_DATE(),                           'Mới',        DATE_ADD(CURRENT_DATE(), INTERVAL 2 DAY),    '10:00', NULL);

INSERT INTO LIENHE (HoTen, Email, SoDienThoai, ChuDe, NoiDung, DaXuLy) VALUES
('Khách Hàng Mẫu', 'customer@gmail.com', '0901234567', 'Tư vấn dịch vụ', 'Muốn tư vấn thay dầu định kỳ', 0),
('Khách vãng lai', 'khach@gmail.com',    '0922222222', 'Hỏi giá',        'Giá bảo dưỡng bao nhiêu?',     1);

INSERT INTO HOADON (MaKH, MaXe, UserId, NgayLap, TongTien, HinhThucTT, TrangThai) VALUES
(1, 1, 1, DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), 0, 'Tiền mặt',    'Hoàn thành'),
(1, 2, 1, DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), 0, 'Chuyển khoản','Đang xử lý'),
(1, 1, 1, CURRENT_DATE(),                           0, NULL,           'Chờ xác nhận');

INSERT INTO CHITIET_HDDV (MaHD, MaDV, SoLuong, DonGia, ThanhTien) VALUES
(1, 1, 1, 1500000, 1500000),
(1, 2, 1,  150000,  150000),
(2, 3, 1, 1500000, 1500000),
(3, 4, 1,  300000,  300000);

INSERT INTO CHITIET_HDSP (MaHD, MaSP, SoLuong, DonGia, ThanhTien) VALUES
(1, 1, 4, 250000, 1000000),
(1, 7, 1, 100000,  100000),
(2, 2, 1,  80000,   80000),
(3, 8, 2,  50000,  100000);

-- =============================================
-- HOÀN TẤT
-- =============================================
SELECT 'Database GaraOToManagement đã được khởi tạo thành công!' AS Status;
SELECT 'Tài khoản: admin / 123456 (Admin)' AS Info
UNION ALL
SELECT 'Tài khoản: customer / 123456 (Customer)';
