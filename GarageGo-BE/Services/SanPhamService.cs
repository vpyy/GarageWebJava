using GarageGo_BE.Models;
using System.Text;
using System.Text.Json;

namespace GarageGo_BE.Services
{
    public class SanPhamService : ISanPhamService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        public SanPhamService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _baseUrl = configuration["ApiSettings:BaseUrl"] + "/SanPham";
        }

        public async Task<List<SanPham>> GetAllAsync()
        {
            var response = await _httpClient.GetAsync(_baseUrl);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<SanPham>>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<SanPham>();
        }

        public async Task<List<SanPham>> GetInStockAsync()
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/InStock");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<SanPham>>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<SanPham>();
        }

        public async Task<SanPham?> GetByIdAsync(int id)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/{id}");

            if (!response.IsSuccessStatusCode)
                return null;

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<SanPham>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<bool> CreateAsync(SanPham sanPham)
        {
            var json = JsonSerializer.Serialize(sanPham);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(_baseUrl, content);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> UpdateAsync(SanPham sanPham)
        {
            var json = JsonSerializer.Serialize(sanPham);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync($"{_baseUrl}/{sanPham.Id}", content);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"{_baseUrl}/{id}");
            return response.IsSuccessStatusCode;
        }
    }
}
