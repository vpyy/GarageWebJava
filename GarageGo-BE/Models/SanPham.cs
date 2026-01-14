using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GarageGo_BE.Models
{
    [Table("SANPHAM")]
    public class SanPham
    {
        [Key]
        [Column("MaSP")]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        [Column("TenSP")]
        public string TenSanPham { get; set; } = string.Empty;

        [StringLength(500)]
        public string? MoTa { get; set; }

        [StringLength(255)]
        [Column("HinhAnh")]
        public string? HinhAnh { get; set; }

        [Required]
        [Column("DonGia", TypeName = "decimal(18,2)")]
        public decimal Gia { get; set; }

        [StringLength(20)]
        [Column("DonVi")]
        public string? DonVi { get; set; }

        [Column("SoLuongTon")]
        public int SoLuongTon { get; set; } = 0;
    }
}
