-- =============================================
-- FIX PASSWORD + ROLE CHO USERS
-- Chạy trong MySQL Workbench
-- =============================================

USE GaraOToManagement;

-- Xem trạng thái hiện tại
SELECT UserId, Username, Email, Role, IsActive, LEFT(Password, 30) AS PwdPrefix FROM USERS;

-- Fix password đúng cho admin
UPDATE USERS
SET Password = '$2a$10$XGChlyDfMqFEKi9.6hnDCu.xTwylMiuwLNa13zvhCCCzitg8oRE6e',
    Role     = 'Admin'
WHERE Username = 'admin';

-- Fix password đúng cho customer
UPDATE USERS
SET Password = '$2a$10$XGChlyDfMqFEKi9.6hnDCu.xTwylMiuwLNa13zvhCCCzitg8oRE6e',
    Role     = 'Customer'
WHERE Username = 'customer';

-- Tạo customer nếu chưa có
INSERT IGNORE INTO USERS (Username, Password, Email, Role, IsActive) VALUES
('customer', '$2a$10$XGChlyDfMqFEKi9.6hnDCu.xTwylMiuwLNa13zvhCCCzitg8oRE6e', 'customer@gmail.com', 'Customer', 1);

-- Kiểm tra kết quả
SELECT UserId, Username, Email, Role, IsActive FROM USERS;

-- =============================================
-- Kết quả mong đợi:
-- admin    | Role = 'Admin'    | IsActive = 1
-- customer | Role = 'Customer' | IsActive = 1
-- =============================================
