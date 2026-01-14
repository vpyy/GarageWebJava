using GarageGo_BE.Models;
using System.Text;
using System.Text.Json;

namespace GarageGo_BE.Services
{
    public class KhachHangService : IKhachHangService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        public KhachHangService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _baseUrl = configuration["ApiSettings:BaseUrl"] + "/KhachHang";
        }

        public async Task<List<KhachHang>> GetAllAsync()
        {
            var response = await _httpClient.GetAsync(_baseUrl);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<KhachHang>>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<KhachHang>();
        }

        public async Task<KhachHang?> GetByIdAsync(int id)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/{id}");

            if (!response.IsSuccessStatusCode)
                return null;

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<KhachHang>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<bool> CreateAsync(KhachHang khachHang)
        {
            var json = JsonSerializer.Serialize(khachHang);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(_baseUrl, content);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> UpdateAsync(KhachHang khachHang)
        {
            var json = JsonSerializer.Serialize(khachHang);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync($"{_baseUrl}/{khachHang.MaKH}", content);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"{_baseUrl}/{id}");
            return response.IsSuccessStatusCode;
        }

        public async Task<KhachHang?> GetBySDTAsync(string sdt)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/sdt/{sdt}");

            if (!response.IsSuccessStatusCode)
                return null;

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<KhachHang>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
    }
}
