package com.garagego.service;

import com.garagego.dto.hoadon.HoaDonCreateRequest;
import com.garagego.dto.hoadon.HoaDonResponse;
import com.garagego.model.*;
import com.garagego.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HoaDonService {

    private final HoaDonRepository hoaDonRepository;
    private final DichVuRepository dichVuRepository;
    private final SanPhamRepository sanPhamRepository;
    private final ChiTietHDDVRepository chiTietHDDVRepository;
    private final ChiTietHDSPRepository chiTietHDSPRepository;

    public List<HoaDonResponse> getAll() {
        return hoaDonRepository.findAllWithKhachHangAndXe()
                .stream().map(h -> toResponse(h, false)).toList();
    }

    public HoaDonResponse getById(Integer id) {
        HoaDon hd = hoaDonRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));
        return toResponse(hd, true);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "thongke",   allEntries = true),
        @CacheEvict(value = "dashboard", allEntries = true),
        @CacheEvict(value = "sanpham",   allEntries = true)  // tồn kho thay đổi
    })
    public HoaDonResponse create(HoaDonCreateRequest request) {
        HoaDon hd = new HoaDon();
        hd.setMaKH(request.getMaKH());
        hd.setMaXe(request.getMaXe());
        hd.setUserId(request.getUserId());
        hd.setNgayLap(LocalDateTime.now());
        hd.setHinhThucTT(request.getHinhThucTT());
        hd.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "Chờ xác nhận");
        hd.setTongTien(BigDecimal.ZERO);
        hoaDonRepository.save(hd);

        BigDecimal tongTien = BigDecimal.ZERO;

        if (request.getDichVus() != null) {
            for (HoaDonCreateRequest.DichVuItem item : request.getDichVus()) {
                DichVu dv = dichVuRepository.findById(item.getMaDV())
                        .orElseThrow(() -> new RuntimeException("Dịch vụ " + item.getMaDV() + " không tồn tại"));
                ChiTietHDDV ct = new ChiTietHDDV();
                ct.setMaHD(hd.getMaHD());
                ct.setMaDV(item.getMaDV());
                ct.setSoLuong(item.getSoLuong());
                ct.setDonGia(dv.getGia());
                ct.setThanhTien(dv.getGia().multiply(BigDecimal.valueOf(item.getSoLuong())));
                chiTietHDDVRepository.save(ct);
                tongTien = tongTien.add(ct.getThanhTien());
            }
        }

        if (request.getSanPhams() != null) {
            for (HoaDonCreateRequest.SanPhamItem item : request.getSanPhams()) {
                SanPham sp = sanPhamRepository.findById(item.getMaSP())
                        .orElseThrow(() -> new RuntimeException("Sản phẩm " + item.getMaSP() + " không tồn tại"));
                if (sp.getSoLuongTon() < item.getSoLuong()) {
                    throw new RuntimeException("Sản phẩm " + sp.getTenSanPham() + " không đủ tồn kho");
                }
                ChiTietHDSP ct = new ChiTietHDSP();
                ct.setMaHD(hd.getMaHD());
                ct.setMaSP(item.getMaSP());
                ct.setSoLuong(item.getSoLuong());
                ct.setDonGia(sp.getGia());
                ct.setThanhTien(sp.getGia().multiply(BigDecimal.valueOf(item.getSoLuong())));
                chiTietHDSPRepository.save(ct);
                tongTien = tongTien.add(ct.getThanhTien());
                sp.setSoLuongTon(sp.getSoLuongTon() - item.getSoLuong());
                sanPhamRepository.save(sp);
            }
        }

        hd.setTongTien(tongTien);
        hoaDonRepository.save(hd);
        return getById(hd.getMaHD());
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "thongke",   allEntries = true),
        @CacheEvict(value = "dashboard", allEntries = true)
    })
    public void complete(Integer id) {
        HoaDon hd = hoaDonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));
        hd.setTrangThai("Hoàn thành");
        hoaDonRepository.save(hd);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "thongke",   allEntries = true),
        @CacheEvict(value = "dashboard", allEntries = true),
        @CacheEvict(value = "sanpham",   allEntries = true)  // hoàn trả tồn kho
    })
    public void delete(Integer id) {
        HoaDon hd = hoaDonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));
        List<ChiTietHDSP> chiTietSPs = chiTietHDSPRepository.findByMaHD(id);
        for (ChiTietHDSP ct : chiTietSPs) {
            sanPhamRepository.findById(ct.getMaSP()).ifPresent(sp -> {
                sp.setSoLuongTon(sp.getSoLuongTon() + ct.getSoLuong());
                sanPhamRepository.save(sp);
            });
        }
        hoaDonRepository.delete(hd);
    }

    private HoaDonResponse toResponse(HoaDon hd, boolean includeDetails) {
        HoaDonResponse res = new HoaDonResponse();
        res.setMaHD(hd.getMaHD());
        res.setMaKH(hd.getMaKH());
        res.setMaXe(hd.getMaXe());
        res.setUserId(hd.getUserId());
        res.setNgayLap(hd.getNgayLap());
        res.setTongTien(hd.getTongTien());
        res.setHinhThucTT(hd.getHinhThucTT() != null ? hd.getHinhThucTT() : "COD");
        res.setTrangThai(hd.getTrangThai() != null ? hd.getTrangThai() : "Chờ xác nhận");
        res.setUsername(hd.getUser() != null ? hd.getUser().getUsername() : "Hệ thống");

        if (hd.getKhachHang() != null) {
            var kh = hd.getKhachHang();
            res.setKhachHang(new HoaDonResponse.KhachHangInfo(
                    kh.getMaKH(), kh.getTenKH(), kh.getSdt(), kh.getEmail(), kh.getDiaChi()));
        }
        if (hd.getXe() != null) {
            var xe = hd.getXe();
            res.setXe(new HoaDonResponse.XeInfo(
                    xe.getMaXe(), xe.getBienSo(), xe.getHangXe(), xe.getDoiXe(), xe.getMauXe()));
        }

        if (includeDetails) {
            List<ChiTietHDDV> dvList = chiTietHDDVRepository.findByMaHD(hd.getMaHD());
            res.setChiTietDichVus(dvList.stream().map(ct -> {
                HoaDonResponse.DichVuInfo dvInfo = null;
                if (ct.getDichVu() != null) {
                    var dv = ct.getDichVu();
                    dvInfo = new HoaDonResponse.DichVuInfo(
                            dv.getMaDV(), dv.getTenDichVu(), dv.getGia(), dv.getMoTa(), dv.getHinhAnh());
                }
                return new HoaDonResponse.ChiTietDVInfo(
                        ct.getMaHD(), ct.getMaDV(), ct.getSoLuong(), ct.getDonGia(), ct.getThanhTien(), dvInfo);
            }).toList());

            List<ChiTietHDSP> spList = chiTietHDSPRepository.findByMaHD(hd.getMaHD());
            res.setChiTietSanPhams(spList.stream().map(ct -> {
                HoaDonResponse.SanPhamInfo spInfo = null;
                if (ct.getSanPham() != null) {
                    var sp = ct.getSanPham();
                    spInfo = new HoaDonResponse.SanPhamInfo(
                            sp.getMaSP(), sp.getTenSanPham(), sp.getGia(), sp.getMoTa(), sp.getHinhAnh());
                }
                return new HoaDonResponse.ChiTietSPInfo(
                        ct.getMaHD(), ct.getMaSP(), ct.getSoLuong(), ct.getDonGia(), ct.getThanhTien(), spInfo);
            }).toList());
        }
        return res;
    }
}
