#!/usr/bin/env node

/**
 * Script to migrate API endpoints from PascalCase to kebab-case
 * Run: node scripts/migrate-api-endpoints.js
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

// Endpoint mappings (old -> new)
const endpointMappings = [
  // Auth
  { old: '/Auth/', new: '/auth/' },
  
  // Products
  { old: '/SanPham/InStock', new: '/san-pham/in-stock' },
  { old: '/SanPham/', new: '/san-pham/' },
  { old: '/SanPham', new: '/san-pham' },
  
  // Services
  { old: '/DichVu/Active', new: '/dich-vu/active' },
  { old: '/DichVu/', new: '/dich-vu/' },
  { old: '/DichVu', new: '/dich-vu' },
  
  // Customers
  { old: '/KhachHang/', new: '/khach-hang/' },
  { old: '/KhachHang', new: '/khach-hang' },
  
  // Vehicles
  { old: '/Xe/ByKhachHang/', new: '/xe/customer/' },
  { old: '/Xe/ByBienSo/', new: '/xe/bien-so/' },
  { old: '/Xe/', new: '/xe/' },
  { old: '/Xe', new: '/xe' },
  
  // Invoices
  { old: '/HoaDon/', new: '/hoa-don/' },
  { old: '/HoaDon', new: '/hoa-don' },
  { old: '/Complete', new: '/complete' },
  
  // Orders
  { old: '/DonHang/', new: '/don-hang/' },
  { old: '/DonHang', new: '/don-hang' },
  
  // Service Requests
  { old: '/Yeucau/', new: '/yeu-cau/' },
  { old: '/Yeucau', new: '/yeu-cau' },
  
  // Contacts
  { old: '/LienHe/', new: '/lien-he/' },
  { old: '/LienHe', new: '/lien-he' },
  
  // Statistics
  { old: '/ThongKe/TongQuan', new: '/thong-ke/tong-quan' },
  { old: '/ThongKe/Dashboard', new: '/thong-ke/dashboard' },
  { old: '/ThongKe/DoanhThuTheoThang', new: '/thong-ke/doanh-thu-theo-thang' },
  { old: '/ThongKe/DoanhThuTheoNgay', new: '/thong-ke/doanh-thu-theo-ngay' },
  { old: '/ThongKe/TopDichVu', new: '/thong-ke/top-dich-vu' },
  { old: '/ThongKe/TopSanPham', new: '/thong-ke/top-san-pham' },
  { old: '/ThongKe/HoaDonGanDay', new: '/thong-ke/hoa-don-gan-day' },
  { old: '/ThongKe/TopKhachHang', new: '/thong-ke/top-khach-hang' },
  { old: '/ThongKe/', new: '/thong-ke/' },
  { old: '/ThongKe', new: '/thong-ke' },
];

// Directories to scan
const dirsToScan = [
  path.join(__dirname, '../src/services'),
  path.join(__dirname, '../src/pages'),
  path.join(__dirname, '../src/components'),
];

// File extensions to process
const fileExtensions = ['.ts', '.tsx', '.js', '.jsx'];

let totalFilesProcessed = 0;
let totalReplacements = 0;

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fileReplacements = 0;

    // Apply all endpoint mappings
    endpointMappings.forEach(mapping => {
      const regex = new RegExp(mapping.old.replace(/\//g, '\\/'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, mapping.new);
        fileReplacements += matches.length;
      }
    });

    // Write back if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      log(`  ✓ ${path.relative(process.cwd(), filePath)} (${fileReplacements} replacements)`, colors.green);
      totalReplacements += fileReplacements;
      return true;
    }
    
    return false;
  } catch (error) {
    log(`  ✗ Error processing ${filePath}: ${error.message}`, colors.red);
    return false;
  }
}

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) {
    log(`  ⚠ Directory not found: ${dir}`, colors.yellow);
    return;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (fileExtensions.includes(path.extname(file))) {
      totalFilesProcessed++;
      processFile(filePath);
    }
  });
}

function main() {
  log('\n========================================', colors.blue);
  log('  API Endpoint Migration Script', colors.blue);
  log('========================================\n', colors.blue);

  log('Starting migration...\n', colors.yellow);

  dirsToScan.forEach(dir => {
    log(`Scanning: ${path.relative(process.cwd(), dir)}`, colors.blue);
    scanDirectory(dir);
  });

  log('\n========================================', colors.blue);
  log(`  Migration Complete!`, colors.green);
  log(`  Files processed: ${totalFilesProcessed}`, colors.green);
  log(`  Total replacements: ${totalReplacements}`, colors.green);
  log('========================================\n', colors.blue);

  if (totalReplacements > 0) {
    log('✓ Migration successful! Please rebuild your frontend:', colors.green);
    log('  npm run build\n', colors.yellow);
  } else {
    log('ℹ No changes needed. All endpoints are already up to date.\n', colors.blue);
  }
}

// Run the script
main();
