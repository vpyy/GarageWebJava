package com.garagego.service;

import com.garagego.dto.khachhang.KhachHangRequest;
import com.garagego.dto.khachhang.KhachHangResponse;
import com.garagego.model.KhachHang;
import com.garagego.repository.KhachHangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class KhachHangService {

    private final KhachHangRepository khachHangRepository;

    public List<KhachHangResponse> getAll() {
        return khachHangRepository.findAll()
                .stream().map(this::toResponse).toList();
    }

    public KhachHangResponse getById(Integer id) {
        KhachHang kh = khachHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));
        return toResponse(kh);
    }

    public KhachHang getBySdt(String sdt) {
        List<KhachHang> list = khachHangRepository.findBySdtWithXe(sdt);
        if (list.isEmpty()) throw new RuntimeException("Không tìm thấy khách hàng");
        return list.get(0);
    }

    public List<KhachHangResponse> search(String q) {
        return khachHangRepository.search(q)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public KhachHangResponse create(KhachHangRequest request) {
        KhachHang kh = new KhachHang();
        kh.setTenKH(request.getTenKH());
        kh.setSdt(request.getSdt());
        kh.setDiaChi(request.getDiaChi());
        kh.setEmail(request.getEmail());
        kh.setNgayDangKy(LocalDateTime.now());
        kh.setUserId(request.getUserId() != null && request.getUserId() != 0 ? request.getUserId() : null);
        khachHangRepository.save(kh);
        return toResponse(kh);
    }

    @Transactional
    public KhachHangResponse update(Integer id, KhachHangRequest request) {
        KhachHang kh = khachHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));
        kh.setTenKH(request.getTenKH());
        kh.setSdt(request.getSdt());
        kh.setDiaChi(request.getDiaChi());
        kh.setEmail(request.getEmail());
        if (request.getUserId() != null && request.getUserId() != 0) {
            kh.setUserId(request.getUserId());
        }
        khachHangRepository.save(kh);
        return toResponse(kh);
    }

    @Transactional
    public void delete(Integer id) {
        if (!khachHangRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy khách hàng");
        }
        khachHangRepository.deleteById(id);
    }

    private KhachHangResponse toResponse(KhachHang kh) {
        return new KhachHangResponse(
                kh.getMaKH(),
                kh.getTenKH(),
                kh.getSdt(),
                kh.getDiaChi(),
                kh.getEmail(),
                kh.getNgayDangKy(),
                kh.getUserId()
        );
    }
}
