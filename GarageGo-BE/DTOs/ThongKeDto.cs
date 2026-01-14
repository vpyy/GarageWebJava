namespace GarageGo_BE.DTOs
{
    public class TongQuanDto
    {
        public int TongKhachHang { get; set; }
        public int TongXe { get; set; }
        public int TongHoaDon { get; set; }
        public int TongDichVu { get; set; }
        public int TongSanPham { get; set; }
        public decimal DoanhThuHomNay { get; set; }
        public decimal DoanhThuThang { get; set; }
        public decimal DoanhThuThangNay { get; set; }
        public decimal DoanhThuNam { get; set; }
        public int SoHoaDonHomNay { get; set; }
        public int SoHoaDonThang { get; set; }
        public int SoHoaDonThangNay { get; set; }
        public int SanPhamSapHet { get; set; }
        public int HoaDonThang { get; set; }
        public int YeuCauDangXuLy { get; set; }
    }

    public class DashboardDto
    {
        public int TongKhachHang { get; set; }
        public int TongXe { get; set; }
        public int TongHoaDon { get; set; }
        public int TongDichVu { get; set; }
        public int TongSanPham { get; set; }
        public decimal DoanhThuThang { get; set; }
        public decimal DoanhThuNam { get; set; }
        public decimal DoanhThuHomNay { get; set; }
        public decimal DoanhThuThangNay { get; set; }
        public int SoHoaDonHomNay { get; set; }
        public int SoHoaDonThangNay { get; set; }
        public int SanPhamSapHet { get; set; }
        public List<DoanhThuTheoThangDto> DoanhThuTheoThang { get; set; } = new();
        public List<DichVuPhoBienDto> DichVuPhoBien { get; set; } = new();
        public List<DichVuPhoBienDto> TopDichVu { get; set; } = new();
        public List<SanPhamPhoBienDto> TopSanPham { get; set; } = new();
        public List<HoaDonGanDayDto> HoaDonGanDay { get; set; } = new();
        public List<KhachHangTopDto> TopKhachHang { get; set; } = new();
    }

    public class DoanhThuTheoThangDto
    {
        public int Thang { get; set; }
        public int Nam { get; set; }
        public decimal DoanhThu { get; set; }
        public int SoHoaDon { get; set; }
    }

    public class DichVuPhoBienDto
    {
        public int MaDV { get; set; }
        public string TenDV { get; set; } = string.Empty;
        public int SoLanSuDung { get; set; }
        public int SoLuong { get; set; }
        public decimal DoanhThu { get; set; }
    }

    public class SanPhamPhoBienDto
    {
        public int MaSP { get; set; }
        public string TenSP { get; set; } = string.Empty;
        public int SoLuongBan { get; set; }
        public int SoLuong { get; set; }
        public decimal DoanhThu { get; set; }
    }

    public class HoaDonGanDayDto
    {
        public int MaHD { get; set; }
        public string TenKH { get; set; } = string.Empty;
        public string BienSo { get; set; } = string.Empty;
        public DateTime NgayLap { get; set; }
        public decimal TongTien { get; set; }
        public string? TrangThai { get; set; }
    }

    public class KhachHangTopDto
    {
        public int MaKH { get; set; }
        public string TenKH { get; set; } = string.Empty;
        public string? SDT { get; set; }
        public int SoHoaDon { get; set; }
        public int SoLanSuDung { get; set; }
        public decimal TongChiTieu { get; set; }
    }

    public class DoanhThuTheoNgayResponse
    {
        public decimal TongDoanhThu { get; set; }
        public int TongHoaDon { get; set; }
        public List<DoanhThuNgayDto> ChiTiet { get; set; } = new();
    }

    public class DoanhThuNgayDto
    {
        public DateTime Ngay { get; set; }
        public decimal TongTien { get; set; }
        public int SoHoaDon { get; set; }
    }
}