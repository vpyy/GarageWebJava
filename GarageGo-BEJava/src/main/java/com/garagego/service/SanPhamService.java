package com.garagego.service;

import com.garagego.dto.sanpham.SanPhamCreateRequest;
import com.garagego.dto.sanpham.SanPhamResponse;
import com.garagego.dto.sanpham.SanPhamUpdateRequest;
import com.garagego.model.SanPham;
import com.garagego.repository.SanPhamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SanPhamService {

    private final SanPhamRepository sanPhamRepository;

    // ─────────────────────────────────────────────────────────────────
    // READ — cache vào Redis
    // ─────────────────────────────────────────────────────────────────

    public List<SanPhamResponse> getAll() {
        return sanPhamRepository.findAll()
                .stream().map(this::toResponse).toList();
    }

    public SanPhamResponse getById(Integer id) {
        return toResponse(findById(id));
    }

    public List<SanPhamResponse> getInStock() {
        return sanPhamRepository.findBySoLuongTonGreaterThan(0)
                .stream().map(this::toResponse).toList();
    }

    /** Low stock — không cache (threshold thay đổi mỗi request) */
    public List<SanPhamResponse> getLowStock(Integer threshold) {
        return sanPhamRepository.findLowStock(threshold)
                .stream().map(this::toResponse).toList();
    }

    /** Search — không cache (query thay đổi liên tục) */
    public List<SanPhamResponse> search(String q) {
        return sanPhamRepository.search(q)
                .stream().map(this::toResponse).toList();
    }

    // ─────────────────────────────────────────────────────────────────
    // WRITE — xóa toàn bộ cache sanpham sau mỗi thao tác thay đổi
    // ─────────────────────────────────────────────────────────────────

    @Transactional
    public SanPhamResponse create(SanPhamCreateRequest request) {
        SanPham sp = new SanPham();
        sp.setTenSanPham(request.getTenSanPham());
        sp.setGia(request.getGia());
        sp.setSoLuongTon(request.getSoLuongTon() != null ? request.getSoLuongTon() : 0);
        sp.setDonVi(request.getDonVi());
        sp.setMoTa(request.getMoTa());
        sp.setHinhAnh(request.getHinhAnh());
        sanPhamRepository.save(sp);
        return toResponse(sp);
    }

    @Transactional
    public SanPhamResponse update(Integer id, SanPhamUpdateRequest request) {
        SanPham sp = findById(id);
        sp.setTenSanPham(request.getTenSanPham());
        sp.setGia(request.getGia());
        sp.setSoLuongTon(request.getSoLuongTon() != null ? request.getSoLuongTon() : 0);
        sp.setDonVi(request.getDonVi());
        sp.setMoTa(request.getMoTa());
        sp.setHinhAnh(request.getHinhAnh());
        sanPhamRepository.save(sp);
        return toResponse(sp);
    }

    @Transactional
    public void delete(Integer id) {
        if (!sanPhamRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy sản phẩm");
        }
        sanPhamRepository.deleteById(id);
    }

    // ─────────────────────────────────────────────────────────────────
    // Internal helpers
    // ─────────────────────────────────────────────────────────────────

    private SanPham findById(Integer id) {
        return sanPhamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
    }

    public SanPhamResponse toResponse(SanPham sp) {
        return new SanPhamResponse(
                sp.getMaSP(),
                sp.getTenSanPham(),
                sp.getGia(),
                sp.getMoTa(),
                sp.getHinhAnh(),
                sp.getSoLuongTon(),
                sp.getDonVi()
        );
    }
}
