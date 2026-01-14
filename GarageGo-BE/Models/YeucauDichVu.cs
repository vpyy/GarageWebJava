using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GarageGo_BE.Models
{
    [Table("YEUCAU_DICHVU")]
    public class YeucauDichVu
    {
        [Key]
        public int MaYeuCau { get; set; }

        [Required]
        [StringLength(100)]
        public string TenKhachHang { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string SoDienThoai { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string DiaChi { get; set; } = string.Empty;

        public int MaDV { get; set; }

        [StringLength(1000)]
        public string? GhiChu { get; set; }

        public DateTime NgayYeuCau { get; set; } = DateTime.Now;

        [StringLength(20)]
        public string TrangThai { get; set; } = "Mới"; // Mới, Đang xử lý, Hoàn thành, Hủy

        public DateTime? NgayHen { get; set; } // Ngày hẹn khách chọn
        [StringLength(10)]
        public string? GioHen { get; set; } // Giờ hẹn (08:30, 15:00 ...)

        [StringLength(50)]
        public string? Username { get; set; } // Username của user đã đặt

        [ForeignKey("MaDV")]
        public DichVu? DichVu { get; set; }
    }
}

