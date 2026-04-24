package com.garagego.service;

import com.garagego.dto.donhang.DonHangCreateRequest;
import com.garagego.dto.donhang.DonHangCreateResponse;
import com.garagego.model.*;
import com.garagego.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DonHangService {

    private final HoaDonRepository hoaDonRepository;
    private final KhachHangRepository khachHangRepository;
    private final SanPhamRepository sanPhamRepository;
    private final ChiTietHDSPRepository chiTietHDSPRepository;
    private final UserRepository userRepository;
    @Transactional
    public DonHangCreateResponse createOrder(DonHangCreateRequest request) {
        // Tìm hoặc tạo khách hàng theo SDT
        KhachHang khachHang = khachHangRepository.findBySdt(request.getSoDienThoai())
                .orElseGet(() -> {
                    KhachHang kh = new KhachHang();
                    kh.setTenKH(request.getHoTen());
                    kh.setSdt(request.getSoDienThoai());
                    kh.setEmail(request.getEmail());
                    kh.setDiaChi(request.getDiaChi());
                    kh.setNgayDangKy(LocalDateTime.now());
                    return khachHangRepository.save(kh);
                });

        // Tạo hóa đơn
        HoaDon hd = new HoaDon();
        hd.setMaKH(khachHang.getMaKH());
        hd.setMaXe(null);   // đơn hàng online không có xe
        // Gán userId nếu có username
        if (request.getUsername() != null) {
            userRepository.findByUsername(request.getUsername())
                    .ifPresent(u -> hd.setUserId(u.getUserId()));
        }
        hd.setNgayLap(LocalDateTime.now());
        hd.setHinhThucTT(request.getPhuongThucThanhToan() != null
                ? request.getPhuongThucThanhToan() : "COD");
        hd.setTrangThai("Chờ xác nhận");
        hd.setTongTien(BigDecimal.ZERO);
        hoaDonRepository.save(hd);

        BigDecimal tongTien = BigDecimal.ZERO;

        // Thêm sản phẩm
        if (request.getSanPhams() != null) {
            for (DonHangCreateRequest.SanPhamItem item : request.getSanPhams()) {
                SanPham sp = sanPhamRepository.findById(item.getMaSP())
                        .orElseThrow(() -> new RuntimeException(
                                "Sản phẩm " + item.getMaSP() + " không tồn tại"));

                if (sp.getSoLuongTon() < item.getSoLuong()) {
                    throw new RuntimeException(
                            "Sản phẩm " + sp.getTenSanPham() + " không đủ tồn kho");
                }

                BigDecimal donGia = item.getDonGia() != null ? item.getDonGia() : sp.getGia();
                BigDecimal thanhTien = donGia.multiply(BigDecimal.valueOf(item.getSoLuong()));

                ChiTietHDSP ct = new ChiTietHDSP();
                ct.setMaHD(hd.getMaHD());
                ct.setMaSP(item.getMaSP());
                ct.setSoLuong(item.getSoLuong());
                ct.setDonGia(donGia);
                ct.setThanhTien(thanhTien);
                chiTietHDSPRepository.save(ct);

                tongTien = tongTien.add(thanhTien);

                // Trừ tồn kho
                sp.setSoLuongTon(sp.getSoLuongTon() - item.getSoLuong());
                sanPhamRepository.save(sp);
            }
        }

        hd.setTongTien(tongTien);
        hoaDonRepository.save(hd);

        return new DonHangCreateResponse(
                true,
                "Đặt hàng thành công",
                hd.getMaHD(),
                tongTien
        );
    }

    /**
     * Lấy danh sách đơn hàng của user theo username.
     * Trả về dạng Map để frontend dễ dùng.
     */
    public List<Map<String, Object>> getOrdersByUsername(String username) {
        // Tìm userId từ username
        var userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return List.of();

        Integer userId = userOpt.get().getUserId();

        // Lấy tất cả hóa đơn của user này
        List<HoaDon> hoaDons = hoaDonRepository.findAllWithKhachHangAndXe()
                .stream()
                .filter(h -> userId.equals(h.getUserId()))
                .toList();

        List<Map<String, Object>> result = new ArrayList<>();
        for (HoaDon hd : hoaDons) {
            Map<String, Object> order = new HashMap<>();
            order.put("maHD", hd.getMaHD());
            order.put("tongTien", hd.getTongTien());
            order.put("trangThai", hd.getTrangThai());
            order.put("phuongThucThanhToan", hd.getHinhThucTT());
            order.put("ngayTao", hd.getNgayLap());

            // Thông tin khách hàng
            if (hd.getKhachHang() != null) {
                order.put("hoTen", hd.getKhachHang().getTenKH());
                order.put("soDienThoai", hd.getKhachHang().getSdt());
                order.put("email", hd.getKhachHang().getEmail());
                order.put("diaChi", hd.getKhachHang().getDiaChi());
            }

            // Chi tiết sản phẩm
            List<Map<String, Object>> items = new ArrayList<>();
            if (hd.getChiTietSanPhams() != null) {
                for (var ct : hd.getChiTietSanPhams()) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("maSP", ct.getMaSP());
                    item.put("soLuong", ct.getSoLuong());
                    item.put("donGia", ct.getDonGia());
                    item.put("thanhTien", ct.getThanhTien());
                    if (ct.getSanPham() != null) {
                        item.put("tenSP", ct.getSanPham().getTenSanPham());
                    }
                    items.add(item);
                }
            }
            order.put("sanPhams", items);
            result.add(order);
        }
        return result;
    }
}
