using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using MySqlConnector;

namespace GarageGo_BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LienHeController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public LienHeController(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        // GET: api/LienHe
        [HttpGet]
        public IActionResult GetAll()
        {
            var list = new List<object>();
            using (var conn = new MySqlConnection(_connectionString))
            {
                conn.Open();
                var cmd = new MySqlCommand("SELECT * FROM LIENHE ORDER BY NgayGui DESC", conn);
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    list.Add(new {
                        MaLienHe = reader["MaLienHe"],
                        HoTen = reader["HoTen"],
                        Email = reader["Email"],
                        SoDienThoai = reader["SoDienThoai"],
                        ChuDe = reader["ChuDe"],
                        NoiDung = reader["NoiDung"],
                        NgayGui = reader["NgayGui"],
                        DaXuLy = reader["DaXuLy"],
                        Username = reader["Username"] != DBNull.Value ? reader["Username"] : null
                    });
                }
            }
            return Ok(list);
        }

        // POST: api/LienHe
        [HttpPost]
        public IActionResult Create([FromBody] LienHeRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.HoTen) || string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { message = "Thiếu thông tin bắt buộc" });
            }

            using (var conn = new MySqlConnection(_connectionString))
            {
                conn.Open();
                var cmd = new MySqlCommand(
                    "INSERT INTO LIENHE (HoTen, Email, SoDienThoai, ChuDe, NoiDung, NgayGui, DaXuLy, Username) " +
                    "VALUES (@HoTen, @Email, @SoDienThoai, @ChuDe, @NoiDung, @NgayGui, 0, @Username); " +
                    "SELECT LAST_INSERT_ID();", conn);
                
                cmd.Parameters.AddWithValue("@HoTen", request.HoTen);
                cmd.Parameters.AddWithValue("@Email", request.Email);
                cmd.Parameters.AddWithValue("@SoDienThoai", request.SoDienThoai ?? "");
                cmd.Parameters.AddWithValue("@ChuDe", request.ChuDe ?? "");
                cmd.Parameters.AddWithValue("@NoiDung", request.NoiDung ?? "");
                cmd.Parameters.AddWithValue("@NgayGui", DateTime.Now);
                cmd.Parameters.AddWithValue("@Username", (object?)request.Username ?? DBNull.Value);
                
                var result = cmd.ExecuteScalar();
                var id = result != null ? Convert.ToInt32(result) : 0;
                return Ok(new { maLienHe = id, message = "Gửi liên hệ thành công" });
            }
        }

        // PUT: api/LienHe/update-status
        [HttpPut("update-status")]
        public IActionResult UpdateStatus(int id, bool daxuly)
        {
            using (var conn = new MySqlConnection(_connectionString))
            {
                conn.Open();
                var cmd = new MySqlCommand("UPDATE LIENHE SET DaXuLy=@DaXuLy WHERE MaLienHe=@Id", conn);
                cmd.Parameters.AddWithValue("@DaXuLy", daxuly);
                cmd.Parameters.AddWithValue("@Id", id);
                var count = cmd.ExecuteNonQuery();
                return Ok(new { updated = count });
            }
        }

        public class LienHeRequest
        {
            public string HoTen { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string? SoDienThoai { get; set; }
            public string? ChuDe { get; set; }
            public string? NoiDung { get; set; }
            public string? Username { get; set; }
        }
    }
}
