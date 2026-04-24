package com.garagego.dto.thongke;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TongQuanDto {
    private long tongKhachHang;
    private long tongXe;
    private long tongHoaDon;
    private long tongDichVu;
    private long tongSanPham;
    private BigDecimal doanhThuHomNay;
    private BigDecimal doanhThuThang;
    private BigDecimal doanhThuThangNay;
    private BigDecimal doanhThuNam;
    private long soHoaDonHomNay;
    private long soHoaDonThang;
    private long soHoaDonThangNay;
    private long sanPhamSapHet;
    private long hoaDonThang;
    private long yeuCauDangXuLy;
}
