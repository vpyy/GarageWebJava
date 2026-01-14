using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GarageGo_BE.Models
{
    [Table("XE")]
    public class Xe
    {
        [Key]
        public int MaXe { get; set; }

        [Required]
        [StringLength(20)]
        public string BienSo { get; set; } = string.Empty; // ✅ Thêm

        [StringLength(50)]
        public string? HangXe { get; set; }

        public int? DoiXe { get; set; }

        [StringLength(30)]
        public string? MauXe { get; set; }

        [Required]
        public int MaKH { get; set; }

        [ForeignKey("MaKH")]
        public KhachHang? KhachHang { get; set; }
    }
}
