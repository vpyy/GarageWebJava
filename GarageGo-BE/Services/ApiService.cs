using GarageGo_BE.Models;
using System.Text.Json;

namespace GaraWeb.Services
{
    public class ApiService : IApiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public ApiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<List<DichVu>> GetDichVusAsync()
        {
            try
            {
                var baseUrl = _configuration["ApiSettings:BaseUrl"];
                var response = await _httpClient.GetAsync($"{baseUrl}/DichVu");
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var dichVus = JsonSerializer.Deserialize<List<DichVu>>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    return dichVus ?? new List<DichVu>();
                }
            }
            catch (Exception ex)
            {
                // Log error
                Console.WriteLine($"Error getting dich vus: {ex.Message}");
            }
            
            return new List<DichVu>();
        }

        public async Task<List<SanPham>> GetSanPhamsAsync()
        {
            try
            {
                var baseUrl = _configuration["ApiSettings:BaseUrl"];
                var response = await _httpClient.GetAsync($"{baseUrl}/SanPham");
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var sanPhams = JsonSerializer.Deserialize<List<SanPham>>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    return sanPhams ?? new List<SanPham>();
                }
            }
            catch (Exception ex)
            {
                // Log error
                Console.WriteLine($"Error getting san phams: {ex.Message}");
            }
            
            return new List<SanPham>();
        }

        public async Task<SanPham> GetSanPhamByIdAsync(int id)
        {
            try
            {
                var baseUrl = _configuration["ApiSettings:BaseUrl"];
                var response = await _httpClient.GetAsync($"{baseUrl}/SanPham/{id}");
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var sanPham = JsonSerializer.Deserialize<SanPham>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    return sanPham ?? new SanPham();
                }
            }
            catch (Exception ex)
            {
                // Log error
                Console.WriteLine($"Error getting san pham by id: {ex.Message}");
            }
            
            return new SanPham();
        }

        public async Task<bool> CreateYeucauDichVuAsync(YeucauDichVu yeucau)
        {
            try
            {
                var baseUrl = _configuration["ApiSettings:BaseUrl"];
                var json = JsonSerializer.Serialize(yeucau);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync($"{baseUrl}/Yeucau", content);
                
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating yeucau: {ex.Message}");
                return false;
            }
        }
    }
}
