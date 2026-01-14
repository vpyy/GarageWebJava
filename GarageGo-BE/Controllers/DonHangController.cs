using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GarageGo_BE.Data;
using GarageGo_BE.Models;

namespace GarageGo_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonHangController : ControllerBase
    {
        private readonly GarageDbContext _context;

        public DonHangController(GarageDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<object>> CreateOrder(DonHangCreateDto dto)
        {
            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            using var transaction = connection.BeginTransaction();

            try
            {
                _context.Database.UseTransaction(transaction as System.Data.Common.DbTransaction);

                // Tìm hoặc tạo khách hàng
                var khachHang = await _context.KhachHangs
                    .FirstOrDefaultAsync(k => k.SDT == dto.SoDienThoai);

                if (khachHang == null)
                {
                    khachHang = new KhachHang
                    {
                        TenKH = dto.HoTen,
                        SDT = dto.SoDienThoai,
                        Email = dto.Email,
                        DiaChi = dto.DiaChi
                    };
                    _context.KhachHangs.Add(khachHang);
                    await _context.SaveChangesAsync();
                }

                // Tạo hóa đơn
                var hoaDon = new HoaDon
                {
                    MaKH = khachHang.MaKH,
                    MaXe = null, // No vehicle for product orders
                    UserId = null, // No specific user for online orders
                    NgayLap = DateTime.Now,
                    HinhThucTT = dto.PhuongThucThanhToan,
                    TrangThai = "Chờ xác nhận",
                    TongTien = 0
                };

                _context.HoaDons.Add(hoaDon);
                await _context.SaveChangesAsync();

                decimal tongTien = 0;

                // Thêm sản phẩm vào hóa đơn
                if (dto.SanPhams != null && dto.SanPhams.Any())
                {
                    foreach (var sp in dto.SanPhams)
                    {
                        var sanPham = await _context.SanPhams.FindAsync(sp.MaSP);
                        if (sanPham == null)
                        {
                            await transaction.RollbackAsync();
                            return BadRequest($"Sản phẩm {sp.MaSP} không tồn tại");
                        }

                        if (sanPham.SoLuongTon < sp.SoLuong)
                        {
                            await transaction.RollbackAsync();
                            return BadRequest($"Sản phẩm {sanPham.TenSanPham} không đủ tồn kho");
                        }

                        var chiTiet = new ChiTietHDSP
                        {
                            MaHD = hoaDon.MaHD,
                            MaSP = sp.MaSP,
                            SoLuong = sp.SoLuong,
                            DonGia = sp.DonGia,
                            ThanhTien = sp.DonGia * sp.SoLuong
                        };

                        _context.ChiTietHDSPs.Add(chiTiet);
                        tongTien += sp.DonGia * sp.SoLuong;

                        // Giảm tồn kho
                        sanPham.SoLuongTon -= sp.SoLuong;
                    }
                }

                hoaDon.TongTien = tongTien;
                
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { 
                    success = true, 
                    message = "Đặt hàng thành công",
                    orderId = hoaDon.MaHD,
                    totalAmount = tongTien
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(new { 
                    success = false, 
                    message = $"Lỗi: {ex.Message}" 
                });
            }
        }
    }

    public class DonHangCreateDto
    {
        public string HoTen { get; set; } = string.Empty;
        public string SoDienThoai { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
        public string? GhiChu { get; set; }
        public string PhuongThucThanhToan { get; set; } = "COD";
        public List<SanPhamOrderDto>? SanPhams { get; set; }
        public decimal TongTien { get; set; }
    }

    public class SanPhamOrderDto
    {
        public int MaSP { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
    }
}