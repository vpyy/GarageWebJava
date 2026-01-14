using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GarageGo_BE.Data;
using GarageGo_BE.DTOs;

namespace GarageGo_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThongKeController : ControllerBase
    {
        private readonly GarageDbContext _context;

        public ThongKeController(GarageDbContext context)
        {
            _context = context;
        }

        // GET: api/ThongKe/TongQuan
        [HttpGet("TongQuan")]
        public async Task<ActionResult<TongQuanDto>> GetTongQuan()
        {
            var today = DateTime.Today;
            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;

            var tongQuan = new TongQuanDto
            {
                TongKhachHang = await _context.KhachHangs.CountAsync(),
                TongXe = await _context.Xes.CountAsync(),
                TongHoaDon = await _context.HoaDons.CountAsync(),
                TongDichVu = await _context.DichVus.CountAsync(),
                TongSanPham = await _context.SanPhams.CountAsync(),
                
                // Doanh thu hôm nay
                DoanhThuHomNay = await _context.HoaDons
                    .Where(h => h.NgayLap.Date == today && h.TrangThai == "Hoàn thành")
                    .SumAsync(h => h.TongTien),
                
                // Doanh thu tháng này
                DoanhThuThang = await _context.HoaDons
                    .Where(h => h.NgayLap.Month == currentMonth && h.NgayLap.Year == currentYear && h.TrangThai == "Hoàn thành")
                    .SumAsync(h => h.TongTien),
                
                DoanhThuThangNay = await _context.HoaDons
                    .Where(h => h.NgayLap.Month == currentMonth && h.NgayLap.Year == currentYear && h.TrangThai == "Hoàn thành")
                    .SumAsync(h => h.TongTien),
                
                // Doanh thu năm
                DoanhThuNam = await _context.HoaDons
                    .Where(h => h.NgayLap.Year == currentYear && h.TrangThai == "Hoàn thành")
                    .SumAsync(h => h.TongTien),
                
                // Số hóa đơn hôm nay
                SoHoaDonHomNay = await _context.HoaDons
                    .Where(h => h.NgayLap.Date == today)
                    .CountAsync(),
                
                // Số hóa đơn tháng này
                SoHoaDonThang = await _context.HoaDons
                    .Where(h => h.NgayLap.Month == currentMonth && h.NgayLap.Year == currentYear)
                    .CountAsync(),
                
                SoHoaDonThangNay = await _context.HoaDons
                    .Where(h => h.NgayLap.Month == currentMonth && h.NgayLap.Year == currentYear)
                    .CountAsync(),
                
                // Sản phẩm sắp hết (tồn kho < 10)
                SanPhamSapHet = await _context.SanPhams
                    .Where(sp => sp.SoLuongTon < 10 && sp.SoLuongTon > 0)
                    .CountAsync(),
                
                HoaDonThang = await _context.HoaDons
                    .Where(h => h.NgayLap.Month == currentMonth && h.NgayLap.Year == currentYear)
                    .CountAsync(),
                
                YeuCauDangXuLy = await _context.YeucauDichVus
                    .Where(y => y.TrangThai == "Đang xử lý")
                    .CountAsync()
            };

            return tongQuan;
        }

        // GET: api/ThongKe/DoanhThuTheoThang
        [HttpGet("DoanhThuTheoThang")]
        public async Task<ActionResult<List<DoanhThuTheoThangDto>>> GetDoanhThuTheoThang()
        {
            var doanhThu = await _context.HoaDons
                .Where(h => h.NgayLap.Year == DateTime.Now.Year && h.TrangThai == "Hoàn thành")
                .GroupBy(h => h.NgayLap.Month)
                .Select(g => new DoanhThuTheoThangDto
                {
                    Thang = g.Key,
                    Nam = DateTime.Now.Year,
                    DoanhThu = g.Sum(h => h.TongTien),
                    SoHoaDon = g.Count()
                })
                .OrderBy(d => d.Thang)
                .ToListAsync();

            return doanhThu;
        }

        // GET: api/ThongKe/DoanhThuTheoNgay
        [HttpGet("DoanhThuTheoNgay")]
        public async Task<ActionResult<DoanhThuTheoNgayResponse>> GetDoanhThuTheoNgay(DateTime? fromDate, DateTime? toDate)
        {
            var from = fromDate ?? DateTime.Now.AddMonths(-1);
            var to = toDate ?? DateTime.Now;

            var hoaDons = await _context.HoaDons
                .Where(h => h.NgayLap >= from && h.NgayLap <= to && h.TrangThai == "Hoàn thành")
                .ToListAsync();

            var chiTiet = hoaDons
                .GroupBy(h => h.NgayLap.Date)
                .Select(g => new DoanhThuNgayDto
                {
                    Ngay = g.Key,
                    TongTien = g.Sum(h => h.TongTien),
                    SoHoaDon = g.Count()
                })
                .OrderBy(d => d.Ngay)
                .ToList();

            return new DoanhThuTheoNgayResponse
            {
                TongDoanhThu = hoaDons.Sum(h => h.TongTien),
                TongHoaDon = hoaDons.Count,
                ChiTiet = chiTiet
            };
        }

        // GET: api/ThongKe/TopDichVu
        [HttpGet("TopDichVu")]
        public async Task<ActionResult<List<DichVuPhoBienDto>>> GetTopDichVu(int top = 5)
        {
            var topDichVu = await _context.ChiTietHDDVs
                .Include(ct => ct.DichVu)
                .GroupBy(ct => new { ct.MaDV, ct.DichVu!.TenDichVu })
                .Select(g => new DichVuPhoBienDto
                {
                    MaDV = g.Key.MaDV,
                    TenDV = g.Key.TenDichVu,
                    SoLuong = g.Sum(ct => ct.SoLuong),
                    SoLanSuDung = g.Count(),
                    DoanhThu = g.Sum(ct => ct.ThanhTien)
                })
                .OrderByDescending(d => d.SoLuong)
                .Take(top)
                .ToListAsync();

            return topDichVu;
        }

        // GET: api/ThongKe/TopSanPham
        [HttpGet("TopSanPham")]
        public async Task<ActionResult<List<SanPhamPhoBienDto>>> GetTopSanPham(int top = 5)
        {
            var topSanPham = await _context.ChiTietHDSPs
                .Include(ct => ct.SanPham)
                .GroupBy(ct => new { ct.MaSP, ct.SanPham!.TenSanPham })
                .Select(g => new SanPhamPhoBienDto
                {
                    MaSP = g.Key.MaSP,
                    TenSP = g.Key.TenSanPham,
                    SoLuong = g.Sum(ct => ct.SoLuong),
                    SoLuongBan = g.Sum(ct => ct.SoLuong),
                    DoanhThu = g.Sum(ct => ct.ThanhTien)
                })
                .OrderByDescending(s => s.SoLuong)
                .Take(top)
                .ToListAsync();

            return topSanPham;
        }

        // GET: api/ThongKe/HoaDonGanDay
        [HttpGet("HoaDonGanDay")]
        public async Task<ActionResult<List<HoaDonGanDayDto>>> GetHoaDonGanDay(int soLuong = 10)
        {
            var hoaDonGanDay = await _context.HoaDons
                .Include(h => h.KhachHang)
                .Include(h => h.Xe)
                .OrderByDescending(h => h.NgayLap)
                .Take(soLuong)
                .Select(h => new HoaDonGanDayDto
                {
                    MaHD = h.MaHD,
                    TenKH = h.KhachHang!.TenKH,
                    BienSo = h.Xe!.BienSo,
                    NgayLap = h.NgayLap,
                    TongTien = h.TongTien,
                    TrangThai = h.TrangThai
                })
                .ToListAsync();

            return hoaDonGanDay;
        }

        // GET: api/ThongKe/TopKhachHang
        [HttpGet("TopKhachHang")]
        public async Task<ActionResult<List<KhachHangTopDto>>> GetTopKhachHang(int top = 10)
        {
            var topKhachHang = await _context.HoaDons
                .Include(h => h.KhachHang)
                .Where(h => h.TrangThai == "Hoàn thành")
                .GroupBy(h => new { h.MaKH, h.KhachHang!.TenKH, h.KhachHang.SDT })
                .Select(g => new KhachHangTopDto
                {
                    MaKH = g.Key.MaKH,
                    TenKH = g.Key.TenKH,
                    SDT = g.Key.SDT,
                    SoHoaDon = g.Count(),
                    SoLanSuDung = g.Count(),
                    TongChiTieu = g.Sum(h => h.TongTien)
                })
                .OrderByDescending(k => k.TongChiTieu)
                .Take(top)
                .ToListAsync();

            return topKhachHang;
        }

        // GET: api/ThongKe/Dashboard
        [HttpGet("Dashboard")]
        public async Task<ActionResult<DashboardDto>> GetDashboard()
        {
            var tongQuan = await GetTongQuan();
            var doanhThuTheoThang = await GetDoanhThuTheoThang();
            var topDichVu = await GetTopDichVu(5);
            var topSanPham = await GetTopSanPham(5);
            var hoaDonGanDay = await GetHoaDonGanDay(5);
            var topKhachHang = await GetTopKhachHang(5);

            var dashboard = new DashboardDto
            {
                TongKhachHang = tongQuan.Value!.TongKhachHang,
                TongXe = tongQuan.Value.TongXe,
                TongHoaDon = tongQuan.Value.TongHoaDon,
                TongDichVu = tongQuan.Value.TongDichVu,
                TongSanPham = tongQuan.Value.TongSanPham,
                DoanhThuHomNay = tongQuan.Value.DoanhThuHomNay,
                DoanhThuThang = tongQuan.Value.DoanhThuThang,
                DoanhThuThangNay = tongQuan.Value.DoanhThuThangNay,
                DoanhThuNam = tongQuan.Value.DoanhThuNam,
                SoHoaDonHomNay = tongQuan.Value.SoHoaDonHomNay,
                SoHoaDonThangNay = tongQuan.Value.SoHoaDonThangNay,
                SanPhamSapHet = tongQuan.Value.SanPhamSapHet,
                DoanhThuTheoThang = doanhThuTheoThang.Value!,
                TopDichVu = topDichVu.Value!,
                TopSanPham = topSanPham.Value!,
                HoaDonGanDay = hoaDonGanDay.Value!,
                TopKhachHang = topKhachHang.Value!
            };

            return dashboard;
        }
    }
}
