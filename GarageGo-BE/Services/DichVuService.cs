using GarageGo_BE.Models;
using System.Text;
using System.Text.Json;

namespace GarageGo_BE.Services
{
    public class DichVuService : IDichVuService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        public DichVuService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _baseUrl = configuration["ApiSettings:BaseUrl"] + "/DichVu";
        }

        public async Task<List<DichVu>> GetAllAsync()
        {
            var response = await _httpClient.GetAsync(_baseUrl);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<DichVu>>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<DichVu>();
        }

        public async Task<List<DichVu>> GetActiveAsync()
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/Active");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<DichVu>>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<DichVu>();
        }

        public async Task<DichVu?> GetByIdAsync(int id)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/{id}");

            if (!response.IsSuccessStatusCode)
                return null;

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<DichVu>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<bool> CreateAsync(DichVu dichVu)
        {
            var json = JsonSerializer.Serialize(dichVu);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(_baseUrl, content);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> UpdateAsync(DichVu dichVu)
        {
            var json = JsonSerializer.Serialize(dichVu);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync($"{_baseUrl}/{dichVu.Id}", content);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"{_baseUrl}/{id}");
            return response.IsSuccessStatusCode;
        }
    }
}
