using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GarageGo_BE.Models
{
    [Table("LIENHE")]
    public class LienHe
    {
        [Key]
        public int MaLienHe { get; set; }

        [Required]
        [StringLength(100)]
        public string HoTen { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string SoDienThoai { get; set; } = string.Empty;

        [StringLength(100)]
        public string? ChuDe { get; set; }

        [Required]
        public string NoiDung { get; set; } = string.Empty;

        public DateTime NgayGui { get; set; } = DateTime.Now;

        public bool DaXuLy { get; set; } = false;

        [StringLength(50)]
        public string? Username { get; set; } // Username của user đã liên hệ
    }
}
