using GarageGo_BE.DTOs;

namespace GarageGo_BE.Services
{
    public interface IThongKeService
    {
        Task<TongQuanDto> GetTongQuanAsync();
        Task<List<DoanhThuTheoThangDto>> GetDoanhThuTheoThangAsync();
        Task<DoanhThuTheoNgayResponse> GetDoanhThuTheoNgayAsync(DateTime fromDate, DateTime toDate);
        Task<List<DichVuPhoBienDto>> GetTopDichVuAsync(int top = 5);
        Task<List<SanPhamPhoBienDto>> GetTopSanPhamAsync(int top = 5);
        Task<List<HoaDonGanDayDto>> GetHoaDonGanDayAsync(int soLuong = 10);
        Task<List<KhachHangTopDto>> GetTopKhachHangAsync(int top = 5);
        Task<DashboardDto> GetDashboardDataAsync();
    }

    // Additional DTOs for API response
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
