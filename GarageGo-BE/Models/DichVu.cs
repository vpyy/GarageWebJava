using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GarageGo_BE.Models
{
    [Table("DICHVU")]
    public class DichVu
    {
        [Key]
        [Column("MaDV")]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        [Column("TenDV")]
        public string TenDichVu { get; set; } = string.Empty;

        [StringLength(500)]
        public string? MoTa { get; set; }

        [StringLength(255)]
        [Column("HinhAnh")]
        public string? HinhAnh { get; set; }

        [Required]
        [Column("DonGia", TypeName = "decimal(18,2)")]
        public decimal Gia { get; set; }

        [Column("TrangThai")]
        public bool TrangThai { get; set; } = true;
    }
}
