using GarageGo_BE.Models;
using GarageGo_BE.DTOs;
using System.Text;
using System.Text.Json;

namespace GarageGo_BE.Services
{
    public class HoaDonService : IHoaDonService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        public HoaDonService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _baseUrl = configuration["ApiSettings:BaseUrl"] + "/HoaDon";
        }

        public async Task<List<HoaDon>> GetAllAsync()
        {
            var response = await _httpClient.GetAsync(_baseUrl);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<HoaDon>>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<HoaDon>();
        }

        public async Task<HoaDon?> GetByIdAsync(int id)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/{id}");

            if (!response.IsSuccessStatusCode)
                return null;

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<HoaDon>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<bool> CreateAsync(HoaDonCreateDto viewModel)
        {
            var dto = new HoaDonCreateDto
            {
                MaKH = viewModel.MaKH,
                MaXe = viewModel.MaXe,
                UserId = viewModel.UserId,
                HinhThucTT = viewModel.HinhThucTT,
                DichVus = viewModel.DichVuItems?.Select(dv => new DichVuDto
                {
                    MaDV = dv.MaDV,
                    SoLuong = dv.SoLuong
                }).ToList(),
                SanPhams = viewModel.SanPhamItems?.Select(sp => new SanPhamDto
                {
                    MaSP = sp.MaSP,
                    SoLuong = sp.SoLuong
                }).ToList()
            };

            var json = JsonSerializer.Serialize(dto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(_baseUrl, content);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> CompleteAsync(int id)
        {
            var response = await _httpClient.PutAsync($"{_baseUrl}/{id}/Complete", null);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"{_baseUrl}/{id}");
            return response.IsSuccessStatusCode;
        }
    }
}
