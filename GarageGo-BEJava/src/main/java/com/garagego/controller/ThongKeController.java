package com.garagego.controller;

import com.garagego.dto.thongke.*;
import com.garagego.service.ThongKeService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/thong-ke")
@RequiredArgsConstructor
public class ThongKeController {

    private final ThongKeService thongKeService;

    @GetMapping("/tong-quan")
    public ResponseEntity<TongQuanDto> getTongQuan() {
        return ResponseEntity.ok(thongKeService.getTongQuan());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDto> getDashboard() {
        return ResponseEntity.ok(thongKeService.getDashboard());
    }

    @GetMapping("/doanh-thu-theo-thang")
    public ResponseEntity<List<DoanhThuTheoThangDto>> getDoanhThuTheoThang() {
        return ResponseEntity.ok(thongKeService.getDoanhThuTheoThang());
    }

    @GetMapping("/doanh-thu-theo-ngay")
    public ResponseEntity<DoanhThuTheoNgayResponse> getDoanhThuTheoNgay(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        LocalDateTime from = fromDate != null ? fromDate.atStartOfDay() : null;
        LocalDateTime to = toDate != null ? toDate.atTime(23, 59, 59) : null;
        return ResponseEntity.ok(thongKeService.getDoanhThuTheoNgay(from, to));
    }

    @GetMapping("/top-dich-vu")
    public ResponseEntity<List<DichVuPhoBienDto>> getTopDichVu(
            @RequestParam(defaultValue = "5") int top) {
        return ResponseEntity.ok(thongKeService.getTopDichVu(top));
    }

    @GetMapping("/top-san-pham")
    public ResponseEntity<List<SanPhamPhoBienDto>> getTopSanPham(
            @RequestParam(defaultValue = "5") int top) {
        return ResponseEntity.ok(thongKeService.getTopSanPham(top));
    }

    @GetMapping("/hoa-don-gan-day")
    public ResponseEntity<List<HoaDonGanDayDto>> getHoaDonGanDay(
            @RequestParam(defaultValue = "10") int soLuong) {
        return ResponseEntity.ok(thongKeService.getHoaDonGanDay(soLuong));
    }

    @GetMapping("/top-khach-hang")
    public ResponseEntity<List<KhachHangTopDto>> getTopKhachHang(
            @RequestParam(defaultValue = "10") int top) {
        return ResponseEntity.ok(thongKeService.getTopKhachHang(top));
    }
}
