using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GarageGo_BE.Models
{
    [Table("CHITIET_HDSP")]
    public class ChiTietHDSP
    {
        [Key]
        public int MaCTSP { get; set; }

        [Required]
        public int MaHD { get; set; }

        [Required]
        public int MaSP { get; set; }

        [Required]
        public int SoLuong { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal DonGia { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ThanhTien { get; set; }

        [ForeignKey("MaHD")]
        public HoaDon? HoaDon { get; set; }

        [ForeignKey("MaSP")]
        public SanPham? SanPham { get; set; }
    }
}
