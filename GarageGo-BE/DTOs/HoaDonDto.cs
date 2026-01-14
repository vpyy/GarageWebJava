using System.ComponentModel.DataAnnotations;

namespace GarageGo_BE.DTOs
{
    public class HoaDonCreateDto
    {
        public int MaKH { get; set; }
        public int MaXe { get; set; }
        public int UserId { get; set; }
        public string? HinhThucTT { get; set; }
        public List<DichVuItemDto>? DichVuItems { get; set; }
        public List<SanPhamItemDto>? SanPhamItems { get; set; }
        public List<DichVuDto>? DichVus { get; set; }
        public List<SanPhamDto>? SanPhams { get; set; }
        public string? GhiChu { get; set; }
    }

    public class DichVuItemDto
    {
        public int MaDV { get; set; }
        public int SoLuong { get; set; }
    }

    public class SanPhamItemDto
    {
        public int MaSP { get; set; }
        public int SoLuong { get; set; }
    }

    public class DichVuDto
    {
        public int MaDV { get; set; }
        public int SoLuong { get; set; }
    }

    public class SanPhamDto
    {
        public int MaSP { get; set; }
        public int SoLuong { get; set; }
    }

    public class HoaDonResponseDto
    {
        public int MaHD { get; set; }
        public int MaKH { get; set; }
        public string TenKH { get; set; } = string.Empty;
        public int MaXe { get; set; }
        public string BienSo { get; set; } = string.Empty;
        public DateTime NgayLap { get; set; }
        public decimal TongTien { get; set; }
        public string? GhiChu { get; set; }
        public List<ChiTietDichVuDto> DichVus { get; set; } = new();
        public List<ChiTietSanPhamDto> SanPhams { get; set; } = new();
    }

    public class ChiTietDichVuDto
    {
        public int MaDV { get; set; }
        public string TenDV { get; set; } = string.Empty;
        public decimal GiaDV { get; set; }
    }

    public class ChiTietSanPhamDto
    {
        public int MaSP { get; set; }
        public string TenSP { get; set; } = string.Empty;
        public decimal GiaSP { get; set; }
        public int SoLuong { get; set; }
        public decimal ThanhTien { get; set; }
    }
}