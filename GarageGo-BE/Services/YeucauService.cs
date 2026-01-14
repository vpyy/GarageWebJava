using GarageGo_BE.Models;
using System.Text.Json;

namespace GarageGo_BE.Services
{
    public class YeucauService : IYeucauService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<YeucauService> _logger;

        public YeucauService(HttpClient httpClient, IConfiguration configuration, ILogger<YeucauService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        private string BaseUrl => _configuration["ApiSettings:BaseUrl"] ?? "https://localhost:7001/api";

        public async Task<List<YeucauDichVu>> GetAllAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{BaseUrl}/Yeucau");
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var yeucaus = JsonSerializer.Deserialize<List<YeucauDichVu>>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    return yeucaus ?? new List<YeucauDichVu>();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting yeucau list");
            }
            return new List<YeucauDichVu>();
        }

        public async Task<YeucauDichVu?> GetByIdAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{BaseUrl}/Yeucau/{id}");
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<YeucauDichVu>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting yeucau by id");
            }
            return null;
        }

        public async Task<bool> UpdateStatusAsync(int id, string trangThai)
        {
            try
            {
                var yeucau = await GetByIdAsync(id);
                if (yeucau == null) return false;

                yeucau.TrangThai = trangThai;

                var json = JsonSerializer.Serialize(yeucau);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

                var response = await _httpClient.PutAsync($"{BaseUrl}/Yeucau/{id}", content);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating yeucau status");
                return false;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"{BaseUrl}/Yeucau/{id}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting yeucau");
                return false;
            }
        }
    }
}

