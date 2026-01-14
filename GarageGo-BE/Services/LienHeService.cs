using GarageGo_BE.Models;
using System.Net.Http;
using System.Text.Json;

namespace GarageGo_BE.Services
{
    public class LienHeService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiUrl;
        public LienHeService(HttpClient client, IConfiguration config)
        {
            _httpClient = client;
            _apiUrl = config["ApiSettings:BaseUrl"] + "/LienHe";
        }
        public async Task<List<LienHe>> GetAll()
        {
            var res = await _httpClient.GetAsync(_apiUrl);
            res.EnsureSuccessStatusCode();
            var content = await res.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<LienHe>>(content, new JsonSerializerOptions{PropertyNameCaseInsensitive = true}) ?? new();
        }
        public async Task<bool> UpdateStatus(int id, bool daXuLy)
        {
            var uri = $"{_apiUrl}/update-status?id={id}&daxuly={daXuLy.ToString().ToLower()}";
            var req = new HttpRequestMessage(HttpMethod.Put, uri);
            var res = await _httpClient.SendAsync(req);
            return res.IsSuccessStatusCode;
        }
    }
}
