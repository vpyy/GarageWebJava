package com.garagego.service;

import com.garagego.dto.thongke.*;
import com.garagego.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ThongKeService {

    private final KhachHangRepository khachHangRepository;
    private final XeRepository xeRepository;
    private final HoaDonRepository hoaDonRepository;
    private final DichVuRepository dichVuRepository;
    private final SanPhamRepository sanPhamRepository;
    private final ChiTietHDDVRepository chiTietHDDVRepository;
    private final ChiTietHDSPRepository chiTietHDSPRepository;
    private final YeucauDichVuRepository yeucauRepository;

    /** Tổng quan */
    public TongQuanDto getTongQuan() {
        int month = LocalDateTime.now().getMonthValue();
        int year = LocalDateTime.now().getYear();

        BigDecimal doanhThuThang = hoaDonRepository.sumDoanhThuThang(month, year);
        long soHoaDonThang = hoaDonRepository.countThang(month, year);

        return new TongQuanDto(
                khachHangRepository.count(),
                xeRepository.count(),
                hoaDonRepository.count(),
                dichVuRepository.count(),
                sanPhamRepository.count(),
                hoaDonRepository.sumDoanhThuHomNay(),
                doanhThuThang,
                doanhThuThang,                          // doanhThuThangNay = doanhThuThang
                hoaDonRepository.sumDoanhThuNam(year),
                hoaDonRepository.countHomNay(),
                soHoaDonThang,
                soHoaDonThang,                          // soHoaDonThangNay = soHoaDonThang
                sanPhamRepository.countLowStock(),
                soHoaDonThang,                          // hoaDonThang
                yeucauRepository.countByTrangThai("Đang xử lý")
        );
    }

    public List<DoanhThuTheoThangDto> getDoanhThuTheoThang() {
        int year = LocalDateTime.now().getYear();
        List<Object[]> rows = hoaDonRepository.doanhThuTheoThang(year);
        List<DoanhThuTheoThangDto> result = new ArrayList<>();
        for (Object[] row : rows) {
            int thang = ((Number) row[0]).intValue();
            BigDecimal doanhThu = row[1] != null ? new BigDecimal(row[1].toString()) : BigDecimal.ZERO;
            long soHoaDon = ((Number) row[2]).longValue();
            result.add(new DoanhThuTheoThangDto(thang, year, doanhThu, soHoaDon));
        }
        return result;
    }

    public DoanhThuTheoNgayResponse getDoanhThuTheoNgay(LocalDateTime fromDate, LocalDateTime toDate) {
        LocalDateTime from = fromDate != null ? fromDate : LocalDateTime.now().minusMonths(1);
        LocalDateTime to = toDate != null ? toDate : LocalDateTime.now();

        BigDecimal tongDoanhThu = hoaDonRepository.sumDoanhThuTrongKhoang(from, to);
        long tongHoaDon = hoaDonRepository.countTrongKhoang(from, to);

        List<Object[]> rows = hoaDonRepository.doanhThuTheoNgay(from, to);
        List<DoanhThuNgayDto> chiTiet = new ArrayList<>();
        for (Object[] row : rows) {
            LocalDate ngay = ((java.sql.Date) row[0]).toLocalDate();
            BigDecimal tongTien = row[1] != null ? new BigDecimal(row[1].toString()) : BigDecimal.ZERO;
            long soHoaDon = ((Number) row[2]).longValue();
            chiTiet.add(new DoanhThuNgayDto(ngay, tongTien, soHoaDon));
        }

        return new DoanhThuTheoNgayResponse(tongDoanhThu, tongHoaDon, chiTiet);
    }

    public List<DichVuPhoBienDto> getTopDichVu(int top) {
        List<Object[]> rows = chiTietHDDVRepository.findTopDichVu();
        List<DichVuPhoBienDto> result = new ArrayList<>();
        int count = 0;
        for (Object[] row : rows) {
            if (count++ >= top) break;
            Integer maDV = ((Number) row[0]).intValue();
            String tenDV = (String) row[1];
            long soLuong = ((Number) row[2]).longValue();
            long soLanSuDung = ((Number) row[3]).longValue();
            BigDecimal doanhThu = row[4] != null ? new BigDecimal(row[4].toString()) : BigDecimal.ZERO;
            result.add(new DichVuPhoBienDto(maDV, tenDV, soLuong, soLanSuDung, doanhThu));
        }
        return result;
    }

    public List<SanPhamPhoBienDto> getTopSanPham(int top) {
        List<Object[]> rows = chiTietHDSPRepository.findTopSanPham();
        List<SanPhamPhoBienDto> result = new ArrayList<>();
        int count = 0;
        for (Object[] row : rows) {
            if (count++ >= top) break;
            Integer maSP = ((Number) row[0]).intValue();
            String tenSP = (String) row[1];
            long soLuong = ((Number) row[2]).longValue();
            BigDecimal doanhThu = row[3] != null ? new BigDecimal(row[3].toString()) : BigDecimal.ZERO;
            result.add(new SanPhamPhoBienDto(maSP, tenSP, soLuong, soLuong, doanhThu));
        }
        return result;
    }

    public List<HoaDonGanDayDto> getHoaDonGanDay(int soLuong) {
        return hoaDonRepository.findRecentWithDetails()
                .stream()
                .limit(soLuong)
                .map(hd -> new HoaDonGanDayDto(
                        hd.getMaHD(),
                        hd.getKhachHang() != null ? hd.getKhachHang().getTenKH() : null,
                        hd.getXe() != null ? hd.getXe().getBienSo() : null,
                        hd.getNgayLap(),
                        hd.getTongTien(),
                        hd.getTrangThai()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<KhachHangTopDto> getTopKhachHang(int top) {
        List<Object[]> rows = hoaDonRepository.findTopKhachHang();
        List<KhachHangTopDto> result = new ArrayList<>();
        int count = 0;
        for (Object[] row : rows) {
            if (count++ >= top) break;
            Integer maKH        = ((Number) row[0]).intValue();
            String  tenKH       = (String) row[1];
            String  sdt         = (String) row[2];
            long    soHoaDon    = ((Number) row[3]).longValue();
            BigDecimal tongChiTieu = row[4] != null
                    ? new BigDecimal(row[4].toString()) : BigDecimal.ZERO;
            result.add(new KhachHangTopDto(maKH, tenKH, sdt, soHoaDon, soHoaDon, tongChiTieu));
        }
        return result;
    }

    /** Dashboard */
    public DashboardDto getDashboard() {
        TongQuanDto tq = getTongQuan();
        DashboardDto dashboard = new DashboardDto();
        dashboard.setTongKhachHang(tq.getTongKhachHang());
        dashboard.setTongXe(tq.getTongXe());
        dashboard.setTongHoaDon(tq.getTongHoaDon());
        dashboard.setTongDichVu(tq.getTongDichVu());
        dashboard.setTongSanPham(tq.getTongSanPham());
        dashboard.setDoanhThuHomNay(tq.getDoanhThuHomNay());
        dashboard.setDoanhThuThang(tq.getDoanhThuThang());
        dashboard.setDoanhThuThangNay(tq.getDoanhThuThangNay());
        dashboard.setDoanhThuNam(tq.getDoanhThuNam());
        dashboard.setSoHoaDonHomNay(tq.getSoHoaDonHomNay());
        dashboard.setSoHoaDonThangNay(tq.getSoHoaDonThangNay());
        dashboard.setSanPhamSapHet(tq.getSanPhamSapHet());
        dashboard.setDoanhThuTheoThang(getDoanhThuTheoThang());
        dashboard.setTopDichVu(getTopDichVu(5));
        dashboard.setTopSanPham(getTopSanPham(5));
        dashboard.setHoaDonGanDay(getHoaDonGanDay(5));
        dashboard.setTopKhachHang(getTopKhachHang(5));
        return dashboard;
    }
}
