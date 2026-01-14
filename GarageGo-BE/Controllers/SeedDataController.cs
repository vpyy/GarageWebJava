using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GarageGo_BE.Data;
using GarageGo_BE.Models;

namespace GarageGo_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedDataController : ControllerBase
    {
        private readonly GarageDbContext _context;

        public SeedDataController(GarageDbContext context)
        {
            _context = context;
        }

        [HttpPost("services")]
        public async Task<IActionResult> SeedServices()
        {
            // Kiểm tra xem đã có dữ liệu chưa
            if (_context.DichVus.Any())
            {
                return Ok("Dữ liệu dịch vụ đã tồn tại");
            }

            var services = new List<DichVu>
            {
                new DichVu
                {
                    TenDichVu = "Thay dầu động cơ",
                    MoTa = "Thay dầu động cơ định kỳ, kiểm tra và bảo dưỡng hệ thống bôi trơn",
                    Gia = 200000,
                    HinhAnh = "https://images.pexels.com/photos/4489743/pexels-photo-4489743.jpeg",
                    TrangThai = true
                },
                new DichVu
                {
                    TenDichVu = "Kiểm tra phanh",
                    MoTa = "Kiểm tra hệ thống phanh, thay má phanh, dầu phanh",
                    Gia = 150000,
                    HinhAnh = "https://images.pexels.com/photos/4489743/pexels-photo-4489743.jpeg",
                    TrangThai = true
                },
                new DichVu
                {
                    TenDichVu = "Bảo dưỡng định kỳ",
                    MoTa = "Bảo dưỡng toàn diện theo km, kiểm tra các hệ thống chính",
                    Gia = 500000,
                    HinhAnh = "https://images.pexels.com/photos/4489743/pexels-photo-4489743.jpeg",
                    TrangThai = true
                },
                new DichVu
                {
                    TenDichVu = "Sửa chữa điện",
                    MoTa = "Sửa chữa hệ thống điện, đèn, còi, điều hòa",
                    Gia = 300000,
                    HinhAnh = "https://images.pexels.com/photos/4489743/pexels-photo-4489743.jpeg",
                    TrangThai = true
                },
                new DichVu
                {
                    TenDichVu = "Rửa xe chuyên nghiệp",
                    MoTa = "Rửa xe, vệ sinh nội thất, đánh bóng sơn",
                    Gia = 100000,
                    HinhAnh = "https://images.pexels.com/photos/4489743/pexels-photo-4489743.jpeg",
                    TrangThai = true
                }
            };

            _context.DichVus.AddRange(services);
            await _context.SaveChangesAsync();

            return Ok($"Đã tạo {services.Count} dịch vụ mẫu");
        }

        [HttpPost("invoices")]
        public async Task<IActionResult> SeedInvoices()
        {
            // Kiểm tra xem đã có dữ liệu chưa
            if (_context.HoaDons.Any())
            {
                return Ok("Dữ liệu hóa đơn đã tồn tại");
            }

            // Tạo khách hàng mẫu
            var khachHang = new KhachHang
            {
                TenKH = "Nguyễn Văn A",
                SDT = "0901234567",
                Email = "nguyenvana@email.com",
                DiaChi = "123 Đường ABC, Quận 1, TP.HCM",
                NgayDangKy = DateTime.Now
            };
            _context.KhachHangs.Add(khachHang);
            await _context.SaveChangesAsync();

            // Tạo hóa đơn mẫu
            var hoaDon = new HoaDon
            {
                MaKH = khachHang.MaKH,
                MaXe = null,
                UserId = null,
                NgayLap = DateTime.Now,
                HinhThucTT = "COD",
                TrangThai = "Chờ xác nhận",
                TongTien = 450000
            };
            _context.HoaDons.Add(hoaDon);
            await _context.SaveChangesAsync();

            // Thêm chi tiết sản phẩm (nếu có sản phẩm)
            var sanPham = await _context.SanPhams.FirstOrDefaultAsync();
            if (sanPham != null)
            {
                var chiTietSP = new ChiTietHDSP
                {
                    MaHD = hoaDon.MaHD,
                    MaSP = sanPham.Id,
                    SoLuong = 1,
                    DonGia = sanPham.Gia,
                    ThanhTien = sanPham.Gia
                };
                _context.ChiTietHDSPs.Add(chiTietSP);
                hoaDon.TongTien = sanPham.Gia;
            }

            await _context.SaveChangesAsync();

            return Ok($"Đã tạo hóa đơn mẫu với ID: {hoaDon.MaHD}");
        }

        [HttpPost("products")]
        public async Task<IActionResult> SeedProducts()
        {
            // Kiểm tra xem đã có dữ liệu chưa
            if (_context.SanPhams.Any())
            {
                return Ok("Dữ liệu sản phẩm đã tồn tại");
            }

            var products = new List<SanPham>
            {
                new SanPham
                {
                    TenSanPham = "Dầu động cơ Shell 5W-30",
                    MoTa = "Dầu động cơ tổng hợp cao cấp Shell Helix Ultra",
                    Gia = 450000,
                    SoLuongTon = 50,
                    HinhAnh = "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg",
                    DonVi = "Chai"
                },
                new SanPham
                {
                    TenSanPham = "Lốp xe Michelin 205/55R16",
                    MoTa = "Lốp xe du lịch Michelin chất lượng cao, độ bền tốt",
                    Gia = 2500000,
                    SoLuongTon = 20,
                    HinhAnh = "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg",
                    DonVi = "Cái"
                },
                new SanPham
                {
                    TenSanPham = "Ắc quy GS 12V-65Ah",
                    MoTa = "Ắc quy khô GS chất lượng cao, tuổi thọ lâu dài",
                    Gia = 1200000,
                    SoLuongTon = 15,
                    HinhAnh = "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg",
                    DonVi = "Cái"
                },
                new SanPham
                {
                    TenSanPham = "Má phanh Bosch",
                    MoTa = "Má phanh Bosch chính hãng, độ bền cao",
                    Gia = 800000,
                    SoLuongTon = 30,
                    HinhAnh = "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg",
                    DonVi = "Bộ"
                }
            };

            _context.SanPhams.AddRange(products);
            await _context.SaveChangesAsync();

            return Ok($"Đã tạo {products.Count} sản phẩm mẫu");
        }
    }
}