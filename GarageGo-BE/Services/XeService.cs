using GarageGo_BE.Models;
using System.Text;
using System.Text.Json;

namespace GarageGo_BE.Services
{
    public class XeService : IXeService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        public XeService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _baseUrl = configuration["ApiSettings:BaseUrl"] + "/Xe";
        }

        public async Task<List<Xe>> GetAllAsync()
        {
            var response = await _httpClient.GetAsync(_baseUrl);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Xe>>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<Xe>();
        }

        public async Task<Xe?> GetByIdAsync(int id)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/{id}");

            if (!response.IsSuccessStatusCode)
                return null;

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Xe>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<List<Xe>> GetByKhachHangAsync(int maKH)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/ByKhachHang/{maKH}");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Xe>>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<Xe>();
        }

        public async Task<Xe?> GetByBienSoAsync(string bienSo)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/ByBienSo/{bienSo}");

            if (!response.IsSuccessStatusCode)
                return null;

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Xe>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<bool> CreateAsync(Xe xe)
        {
            var json = JsonSerializer.Serialize(xe);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(_baseUrl, content);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> UpdateAsync(Xe xe)
        {
            var json = JsonSerializer.Serialize(xe);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync($"{_baseUrl}/{xe.MaXe}", content);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"{_baseUrl}/{id}");
            return response.IsSuccessStatusCode;
        }
    }
}
