using GarageGo_BE.Data;
using GarageGo_BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace GarageGo_BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly GarageDbContext _context;

        public AuthController(GarageDbContext context)
        {
            _context = context;
        }

        public class LoginRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public class RegisterRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public string? Email { get; set; }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Thiếu tên đăng nhập hoặc mật khẩu" });
            }

            // Log để debug
            Console.WriteLine($"[LOGIN] Username: {request.Username}");
            Console.WriteLine($"[LOGIN] Password received: {request.Password}");
            Console.WriteLine($"[LOGIN] Password length: {request.Password.Length}");

            // Password đã được hash từ client, không cần hash lại
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.Password == request.Password && u.IsActive);

            if (user == null)
            {
                // Kiểm tra xem user có tồn tại không
                var userExists = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
                if (userExists != null)
                {
                    Console.WriteLine($"[LOGIN] User found but password mismatch");
                    Console.WriteLine($"[LOGIN] DB Password: {userExists.Password}");
                    Console.WriteLine($"[LOGIN] DB Password length: {userExists.Password.Length}");
                    Console.WriteLine($"[LOGIN] IsActive: {userExists.IsActive}");
                }
                else
                {
                    Console.WriteLine($"[LOGIN] User not found");
                }
                
                return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không đúng" });
            }

            Console.WriteLine($"[LOGIN] Login successful for user: {user.Username}");
            return Ok(new { userId = user.UserId, username = user.Username, email = user.Email, role = user.Role });
        }

        [HttpGet("login")]
        public async Task<IActionResult> LoginGet([FromQuery] string username, [FromQuery] string password)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            {
                return BadRequest(new { message = "Thiếu tên đăng nhập hoặc mật khẩu" });
            }

            Console.WriteLine($"[LOGIN GET] Username: {username}");
            Console.WriteLine($"[LOGIN GET] Password: {password}");

            // Password đã được hash từ client
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Username == username && u.Password == password && u.IsActive);

            if (user == null)
            {
                var allUsers = await _context.Users.Where(u => u.Username == username).ToListAsync();
                Console.WriteLine($"[LOGIN GET] Found {allUsers.Count} users with username {username}");
                foreach (var u in allUsers)
                {
                    Console.WriteLine($"[LOGIN GET] DB Password: '{u.Password}' (len={u.Password.Length})");
                    Console.WriteLine($"[LOGIN GET] Input Password: '{password}' (len={password.Length})");
                    Console.WriteLine($"[LOGIN GET] Match: {u.Password == password}");
                    Console.WriteLine($"[LOGIN GET] IsActive: {u.IsActive}");
                }
                return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không đúng" });
            }

            return Ok(new { userId = user.UserId, username = user.Username, email = user.Email, role = user.Role });
        }
        
        [HttpGet("debug")]
        public async Task<IActionResult> Debug()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users.Select(u => new {
                u.UserId,
                u.Username,
                PasswordLength = u.Password.Length,
                PasswordPreview = u.Password.Substring(0, Math.Min(20, u.Password.Length)) + "...",
                u.Role,
                u.IsActive
            }));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Thiếu tên đăng nhập hoặc mật khẩu" });
            }

            var exists = await _context.Users.AnyAsync(u => u.Username == request.Username);
            if (exists)
            {
                return Conflict(new { message = "Tên đăng nhập đã tồn tại" });
            }

            var user = new User
            {
                Username = request.Username,
                Password = ComputeSha256(request.Password),
                Email = request.Email,
                Role = "Customer",
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { userId = user.UserId, username = user.Username, email = user.Email, role = user.Role });
        }

        private static string ComputeSha256(string raw)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(raw));
            var sb = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++) sb.Append(bytes[i].ToString("x2"));
            return sb.ToString();
        }
    }
}
