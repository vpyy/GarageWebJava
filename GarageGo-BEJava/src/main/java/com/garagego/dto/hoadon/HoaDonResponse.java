package com.garagego.dto.hoadon;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonResponse {
    private Integer maHD;
    private Integer maKH;
    private Integer maXe;
    private Integer userId;
    private LocalDateTime ngayLap;
    private BigDecimal tongTien;
    private String hinhThucTT;
    private String trangThai;
    private String username;

    // nested info
    private KhachHangInfo khachHang;
    private XeInfo xe;
    private List<ChiTietDVInfo> chiTietDichVus;
    private List<ChiTietSPInfo> chiTietSanPhams;

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class KhachHangInfo {
        private Integer maKH;
        private String tenKH;
        private String sdt;
        private String email;
        private String diaChi;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class XeInfo {
        private Integer maXe;
        private String bienSo;
        private String hangXe;
        private Integer doiXe;
        private String mauXe;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ChiTietDVInfo {
        private Integer maHD;
        private Integer maDV;
        private Integer soLuong;
        private BigDecimal donGia;
        private BigDecimal thanhTien;
        private DichVuInfo dichVu;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class DichVuInfo {
        private Integer id;
        private String tenDichVu;
        private BigDecimal gia;
        private String moTa;
        private String hinhAnh;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ChiTietSPInfo {
        private Integer maHD;
        private Integer maSP;
        private Integer soLuong;
        private BigDecimal donGia;
        private BigDecimal thanhTien;
        private SanPhamInfo sanPham;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class SanPhamInfo {
        private Integer maSP;
        private String tenSanPham;
        private BigDecimal gia;
        private String moTa;
        private String hinhAnh;
    }
}
