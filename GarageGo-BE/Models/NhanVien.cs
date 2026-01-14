using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GarageGo_BE.Models
{
    [Table("NHANVIEN")]
    public class NhanVien
    {
        [Key]
        public int MaNV { get; set; }

        [Required]
        [StringLength(100)]
        public string TenNV { get; set; } = string.Empty; // ✅ Thêm

        [StringLength(50)]
        public string? ChucVu { get; set; }

        [StringLength(15)]
        public string? SDT { get; set; }

        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(100)]
        public string? MatKhau { get; set; }

        [StringLength(20)]
        public string? VaiTro { get; set; }
    }
}
