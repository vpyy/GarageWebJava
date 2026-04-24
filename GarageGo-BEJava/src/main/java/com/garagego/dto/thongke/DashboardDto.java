package com.garagego.dto.thongke;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {
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
    private long soHoaDonThangNay;
    private long sanPhamSapHet;
    private List<DoanhThuTheoThangDto> doanhThuTheoThang;
    private List<DichVuPhoBienDto> topDichVu;
    private List<SanPhamPhoBienDto> topSanPham;
    private List<HoaDonGanDayDto> hoaDonGanDay;
    private List<KhachHangTopDto> topKhachHang;
}
