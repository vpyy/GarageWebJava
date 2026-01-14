using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GarageGo_BE.Models
{
    [Table("KHACHHANG")]
    public class KhachHang
    {
        [Key]
        public int MaKH { get; set; }

        [Required]
        [StringLength(100)]
        public string TenKH { get; set; } = string.Empty;

        [Required]
        [StringLength(15)]
        public string SDT { get; set; } = string.Empty;

        [StringLength(200)]
        public string? DiaChi { get; set; }

        [StringLength(100)]
        public string? Email { get; set; }

        public DateTime NgayDangKy { get; set; } = DateTime.Now;

        public int? UserId { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public User? User { get; set; }

        public ICollection<Xe>? DanhSachXe { get; set; }
        public ICollection<HoaDon>? HoaDons { get; set; }
    }
}
