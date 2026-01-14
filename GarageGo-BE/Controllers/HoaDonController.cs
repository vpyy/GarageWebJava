using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GarageGo_BE.Data;
using GarageGo_BE.Models;

namespace GarageGo_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HoaDonController : ControllerBase
    {
        private readonly GarageDbContext _context;

        public HoaDonController(GarageDbContext context)
        {
            _context = context;
        }

        [HttpGet("test")]
        public async Task<ActionResult> TestHoaDon()
        {
            try
            {
                var count = await _context.HoaDons.CountAsync();
                return Ok($"Found {count} invoices in database");
            }
            catch (Exception ex)
            {
                return Ok($"Error: {ex.Message}");
            }
        }

        [HttpGet("schema")]
        public async Task<ActionResult> CheckSchema()
        {
            try
            {
                var query = "DESCRIBE hoadon";
                var columns = new List<object>();
                
                using (var connection = _context.Database.GetDbConnection())
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = query;
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                columns.Add(new
                                {
                                    field = reader.GetString(0), // Field
                                    type = reader.GetString(1), // Type
                                    nullable = reader.GetString(2), // Null
                                    key = reader.GetString(3), // Key
                                    defaultValue = reader.IsDBNull(4) ? null : reader.GetString(4), // Default
                                    extra = reader.GetString(5) // Extra
                                });
                            }
                        }
                    }
                }

                return Ok(new { columns = columns });
            }
            catch (Exception ex)
            {
                return Ok(new { error = ex.Message });
            }
        }

        [HttpGet("simple")]
        public ActionResult GetSimple()
        {
            return Ok(new { message = "Simple endpoint works" });
        }

        [HttpGet]
        public async Task<ActionResult> GetHoaDons()
        {
            try
            {
                var hoaDons = await _context.HoaDons
                    .OrderByDescending(h => h.NgayLap)
                    .Select(h => new
                    {
                        maHD = h.MaHD,
                        maKH = h.MaKH,
                        maXe = h.MaXe,
                        userId = h.UserId,
                        ngayLap = h.NgayLap, // Keep as DateTime, let JSON serializer handle it
                        tongTien = h.TongTien,
                        hinhThucTT = h.HinhThucTT ?? "COD",
                        trangThai = h.TrangThai ?? "Chờ xác nhận",
                        username = h.Username ?? "Hệ thống"
                    })
                    .ToListAsync();

                return Ok(hoaDons);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, innerError = ex.InnerException?.Message });
            }
        }

        // ✅ SỬA LẠI GetHoaDon
        [HttpGet("{id}")]
        public async Task<ActionResult> GetHoaDon(int id)
        {
            try
            {
                var hoaDon = await _context.HoaDons
                    .Where(h => h.MaHD == id)
                    .Select(h => new
                    {
                        maHD = h.MaHD,
                        maKH = h.MaKH,
                        maXe = h.MaXe,
                        userId = h.UserId,
                        ngayLap = h.NgayLap.ToString("yyyy-MM-dd HH:mm:ss"),
                        tongTien = h.TongTien,
                        hinhThucTT = h.HinhThucTT ?? "COD",
                        trangThai = h.TrangThai ?? "Chờ xác nhận",
                        username = h.Username ?? "Hệ thống"
                    })
                    .FirstOrDefaultAsync();

                if (hoaDon == null)
                    return NotFound();

                return Ok(hoaDon);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<HoaDon>> PostHoaDon(HoaDonCreateDto dto)
        {
            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            using var transaction = connection.BeginTransaction();

            try
            {
                _context.Database.UseTransaction(transaction as System.Data.Common.DbTransaction);

                // Tạo hóa đơn
                var hoaDon = new HoaDon
                {
                    MaKH = dto.MaKH,
                    MaXe = dto.MaXe,
                    UserId = dto.UserId,
                    NgayLap = DateTime.Now,
                    HinhThucTT = dto.HinhThucTT,
                    TrangThai = dto.TrangThai ?? "Chờ xác nhận",
                    TongTien = 0
                };

                _context.HoaDons.Add(hoaDon);
                await _context.SaveChangesAsync();

                decimal tongTien = 0;

                // Thêm dịch vụ
                if (dto.DichVus != null && dto.DichVus.Any())
                {
                    foreach (var dv in dto.DichVus)
                    {
                        var dichVu = await _context.DichVus.FindAsync(dv.MaDV);
                        if (dichVu == null)
                        {
                            await transaction.RollbackAsync();
                            return BadRequest($"Dịch vụ {dv.MaDV} không tồn tại");
                        }

                        var chiTiet = new ChiTietHDDV
                        {
                            MaHD = hoaDon.MaHD,
                            MaDV = dv.MaDV,
                            SoLuong = dv.SoLuong,
                            DonGia = dichVu.Gia,
                            ThanhTien = dichVu.Gia * dv.SoLuong // Tính trong code
                        };

                        _context.ChiTietHDDVs.Add(chiTiet);
                        tongTien += dichVu.Gia * dv.SoLuong;
                    }
                }

                // Thêm sản phẩm
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
                            DonGia = sanPham.Gia,
                            ThanhTien = sanPham.Gia * sp.SoLuong // Tính trong code
                        };

                        _context.ChiTietHDSPs.Add(chiTiet);
                        tongTien += sanPham.Gia * sp.SoLuong;

                        sanPham.SoLuongTon -= sp.SoLuong;
                    }
                }

                hoaDon.TongTien = tongTien;
                
                // Lưu tất cả thay đổi trong một lần
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Reload hóa đơn
                hoaDon = await _context.HoaDons
                    .Include(h => h.KhachHang)
                    .Include(h => h.Xe)
                    .Include(h => h.User)
                    .FirstOrDefaultAsync(h => h.MaHD == hoaDon.MaHD);

                return CreatedAtAction(nameof(GetHoaDon), new { id = hoaDon!.MaHD }, hoaDon);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPut("{id}/Complete")]
        public async Task<IActionResult> CompleteHoaDon(int id)
        {
            var hoaDon = await _context.HoaDons.FindAsync(id);
            if (hoaDon == null)
                return NotFound();

            hoaDon.TrangThai = "Hoàn thành";
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHoaDon(int id)
        {
            var hoaDon = await _context.HoaDons
                .Include(h => h.ChiTietDichVus)
                .Include(h => h.ChiTietSanPhams)
                .FirstOrDefaultAsync(h => h.MaHD == id);

            if (hoaDon == null)
                return NotFound();

            // ✅ Thêm null check
            if (hoaDon.ChiTietSanPhams != null)
            {
                foreach (var ct in hoaDon.ChiTietSanPhams)
                {
                    var sanPham = await _context.SanPhams.FindAsync(ct.MaSP);
                    if (sanPham != null)
                        sanPham.SoLuongTon += ct.SoLuong;
                }
            }

            _context.HoaDons.Remove(hoaDon);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class HoaDonCreateDto
    {
        public int MaKH { get; set; }
        public int MaXe { get; set; }
        public int UserId { get; set; }
        public string? HinhThucTT { get; set; }
        public string? TrangThai { get; set; }
        public string? Username { get; set; } // ✅ Thêm username
        public List<DichVuDto>? DichVus { get; set; }
        public List<SanPhamDto>? SanPhams { get; set; }
    }

    public class DichVuDto
    {
        public int MaDV { get; set; }
        public int SoLuong { get; set; }
    }

    public class SanPhamDto
    {
        public int MaSP { get; set; }
        public int SoLuong { get; set; }
    }
}
