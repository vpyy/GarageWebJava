using GarageGo_BE.Models;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace GarageGo_BE.Services
{
    public class AuthService : IAuthService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(HttpClient httpClient, IConfiguration configuration, ILogger<AuthService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
            
            var baseUrl = _configuration["ApiSettings:BaseUrl"];
            _httpClient.BaseAddress = new Uri(baseUrl ?? "https://localhost:7002/api");
        }

        public async Task<User?> LoginAsync(string username, string password)
        {
            try
            {
                // Hash password với SHA256
                var hashedPassword = HashPassword(password);
                
                _logger.LogInformation($"Attempting login for user: {username}");
                _logger.LogInformation($"Hashed password: {hashedPassword}");
                _logger.LogInformation($"API Base URL: {_httpClient.BaseAddress}");
                
                var loginRequest = new
                {
                    username = username,
                    password = hashedPassword
                };
                
                var response = await _httpClient.PostAsJsonAsync("/api/Auth/login", loginRequest);
                
                _logger.LogInformation($"API Response Status: {response.StatusCode}");
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation($"API Response Content: {content}");
                    
                    var result = JsonSerializer.Deserialize<LoginResponse>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    
                    if (result != null)
                    {
                        _logger.LogInformation($"Login successful for user: {result.Username}, Role: {result.Role}");
                        return new User
                        {
                            UserId = result.UserId,
                            Username = result.Username,
                            Email = result.Email ?? "",
                            Role = result.Role
                        };
                    }
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogWarning($"Login failed. Status: {response.StatusCode}, Error: {errorContent}");
                }
                
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi đăng nhập");
                return null;
            }
        }
        
        private class LoginResponse
        {
            public int UserId { get; set; }
            public string Username { get; set; } = string.Empty;
            public string? Email { get; set; }
            public string Role { get; set; } = string.Empty;
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(password);
                var hash = sha256.ComputeHash(bytes);
                return BitConverter.ToString(hash).Replace("-", "").ToLower();
            }
        }
    }
}
