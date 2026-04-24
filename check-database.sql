-- =============================================
-- SCRIPT KIỂM TRA DATABASE
-- Chạy script này trong MySQL Workbench
-- =============================================

-- 1. Kiểm tra database có tồn tại không
SHOW DATABASES LIKE 'GaraOToManagement';

-- 2. Sử dụng database
USE GaraOToManagement;

-- 3. Kiểm tra các bảng
SHOW TABLES;

-- 4. Kiểm tra user admin có tồn tại không
SELECT UserId, Username, Email, Role, IsActive 
FROM USERS 
WHERE Username = 'admin';

-- 5. Kiểm tra password hash của admin
-- Password đúng phải là: $2a$10$XGChlyDfMqFEKi9.6hnDCu.xTwylMiuwLNa13zvhCCCzitg8oRE6e
SELECT UserId, Username, Password, Role 
FROM USERS 
WHERE Username = 'admin';

-- 6. Nếu password SAI, update lại password đúng
-- Uncomment dòng dưới để fix password
-- UPDATE USERS 
-- SET Password = '$2a$10$XGChlyDfMqFEKi9.6hnDCu.xTwylMiuwLNa13zvhCCCzitg8oRE6e' 
-- WHERE Username = 'admin';

-- 7. Kiểm tra lại sau khi update
SELECT UserId, Username, Password, Role 
FROM USERS 
WHERE Username = 'admin';

-- 8. Kiểm tra tất cả users
SELECT UserId, Username, Email, Role, IsActive, CreatedAt 
FROM USERS;

-- =============================================
-- KẾT QUẢ MONG ĐỢI:
-- =============================================
-- Username: admin
-- Password: $2a$10$XGChlyDfMqFEKi9.6hnDCu.xTwylMiuwLNa13zvhCCCzitg8oRE6e
-- Role: ADMIN
-- IsActive: 1
-- =============================================
