using GarageGo_BE.Models;
using GarageGo_BE.DTOs;
using System.Text.Json;

namespace GarageGo_BE.Services
{
    public class ThongKeService : IThongKeService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        public ThongKeService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _baseUrl = configuration["ApiSettings:BaseUrl"] + "/ThongKe";
        }

        public async Task<TongQuanDto> GetTongQuanAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_baseUrl}/TongQuan");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var tongQuanDto = JsonSerializer.Deserialize<TongQuanDto>(content,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                return new TongQuanDto
                {
                    TongKhachHang = tongQuanDto?.TongKhachHang ?? 0,
                    TongXe = tongQuanDto?.TongXe ?? 0,
                    TongHoaDon = tongQuanDto?.TongHoaDon ?? 0,
                    TongDichVu = tongQuanDto?.TongDichVu ?? 0,
                    TongSanPham = tongQuanDto?.TongSanPham ?? 0,
                    DoanhThuHomNay = tongQuanDto?.DoanhThuHomNay ?? 0,
                    DoanhThuThang = tongQuanDto?.DoanhThuThang ?? 0,
                    DoanhThuThangNay = tongQuanDto?.DoanhThuThangNay ?? 0,
                    DoanhThuNam = tongQuanDto?.DoanhThuNam ?? 0,
                    SoHoaDonHomNay = tongQuanDto?.SoHoaDonHomNay ?? 0,
                    SoHoaDonThangNay = tongQuanDto?.SoHoaDonThangNay ?? 0,
                    SanPhamSapHet = tongQuanDto?.SanPhamSapHet ?? 0
                };
            }
            catch
            {
                return new TongQuanDto();
            }
        }

        public async Task<List<DoanhThuTheoThangDto>> GetDoanhThuTheoThangAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_baseUrl}/DoanhThuTheoThang");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<DoanhThuTheoThangDto>>(content,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<DoanhThuTheoThangDto>();
            }
            catch
            {
                return new List<DoanhThuTheoThangDto>();
            }
        }

        public async Task<DoanhThuTheoNgayResponse> GetDoanhThuTheoNgayAsync(DateTime fromDate, DateTime toDate)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_baseUrl}/DoanhThuTheoNgay?fromDate={fromDate:yyyy-MM-dd}&toDate={toDate:yyyy-MM-dd}");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<DoanhThuTheoNgayResponse>(content,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new DoanhThuTheoNgayResponse();
            }
            catch
            {
                return new DoanhThuTheoNgayResponse();
            }
        }

        public async Task<List<DichVuPhoBienDto>> GetTopDichVuAsync(int top = 5)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_baseUrl}/TopDichVu?top={top}");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<DichVuPhoBienDto>>(content,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<DichVuPhoBienDto>();
            }
            catch
            {
                return new List<DichVuPhoBienDto>();
            }
        }

        public async Task<List<SanPhamPhoBienDto>> GetTopSanPhamAsync(int top = 5)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_baseUrl}/TopSanPham?top={top}");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<SanPhamPhoBienDto>>(content,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<SanPhamPhoBienDto>();
            }
            catch
            {
                return new List<SanPhamPhoBienDto>();
            }
        }

        public async Task<List<HoaDonGanDayDto>> GetHoaDonGanDayAsync(int soLuong = 10)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_baseUrl}/HoaDonGanDay?soLuong={soLuong}");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<HoaDonGanDayDto>>(content,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<HoaDonGanDayDto>();
            }
            catch
            {
                return new List<HoaDonGanDayDto>();
            }
        }

        public async Task<List<KhachHangTopDto>> GetTopKhachHangAsync(int top = 5)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_baseUrl}/TopKhachHang?top={top}");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<KhachHangTopDto>>(content,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<KhachHangTopDto>();
            }
            catch
            {
                return new List<KhachHangTopDto>();
            }
        }

        public async Task<DashboardDto> GetDashboardDataAsync()
        {
            var dashboard = new DashboardDto();

            try
            {
                // Lấy tổng quan
                var tongQuan = await GetTongQuanAsync();
                dashboard.TongKhachHang = tongQuan.TongKhachHang;
                dashboard.TongXe = tongQuan.TongXe;
                dashboard.TongHoaDon = tongQuan.TongHoaDon;
                dashboard.TongDichVu = tongQuan.TongDichVu;
                dashboard.TongSanPham = tongQuan.TongSanPham;
                dashboard.DoanhThuHomNay = tongQuan.DoanhThuHomNay;
                dashboard.DoanhThuThangNay = tongQuan.DoanhThuThangNay;
                dashboard.DoanhThuNam = tongQuan.DoanhThuNam;
                dashboard.SoHoaDonHomNay = tongQuan.SoHoaDonHomNay;
                dashboard.SoHoaDonThangNay = tongQuan.SoHoaDonThangNay;
                dashboard.SanPhamSapHet = tongQuan.SanPhamSapHet;

                // Lấy dữ liệu charts song song
                var doanhThuTask = GetDoanhThuTheoThangAsync();
                var topDichVuTask = GetTopDichVuAsync(5);
                var topSanPhamTask = GetTopSanPhamAsync(5);
                var hoaDonTask = GetHoaDonGanDayAsync(5);
                var topKhachHangTask = GetTopKhachHangAsync(5);

                await Task.WhenAll(doanhThuTask, topDichVuTask, topSanPhamTask, hoaDonTask, topKhachHangTask);

                dashboard.DoanhThuTheoThang = await doanhThuTask;
                dashboard.TopDichVu = await topDichVuTask;
                dashboard.TopSanPham = await topSanPhamTask;
                dashboard.HoaDonGanDay = await hoaDonTask;
                dashboard.TopKhachHang = await topKhachHangTask;
            }
            catch
            {
                // Trả về dashboard rỗng nếu có lỗi
            }

            return dashboard;
        }
    }
}
