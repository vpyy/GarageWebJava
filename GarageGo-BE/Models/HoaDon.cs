using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GarageGo_BE.Models
{
    [Table("HOADON")]
    public class HoaDon
    {
        [Key]
        public int MaHD { get; set; }

        [Required]
        public int MaKH { get; set; }

        public int? MaXe { get; set; } // Make optional for product orders

        public int? UserId { get; set; } // Make optional

        public DateTime NgayLap { get; set; } = DateTime.Now;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTien { get; set; } = 0;

        [StringLength(50)]
        public string? HinhThucTT { get; set; }

        [StringLength(30)]
        public string? TrangThai { get; set; }

        [NotMapped]
        [StringLength(50)]
        public string? Username => User?.Username; // Username của user đã mua (computed from User)

        [ForeignKey("MaKH")]
        public KhachHang? KhachHang { get; set; }

        [ForeignKey("MaXe")]
        public Xe? Xe { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        // ✅ Sửa ICollection thành List
        public List<ChiTietHDDV>? ChiTietDichVus { get; set; }
        public List<ChiTietHDSP>? ChiTietSanPhams { get; set; }
    }
}
