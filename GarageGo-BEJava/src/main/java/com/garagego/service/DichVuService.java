package com.garagego.service;

import com.garagego.dto.dichvu.DichVuRequest;
import com.garagego.dto.dichvu.DichVuResponse;
import com.garagego.model.DichVu;
import com.garagego.repository.DichVuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DichVuService {

    private final DichVuRepository dichVuRepository;

    // ─────────────────────────────────────────────────────────────────
    // READ — cache vào Redis
    // ─────────────────────────────────────────────────────────────────

    public List<DichVuResponse> getAll() {
        return dichVuRepository.findAll()
                .stream().map(this::toResponse).toList();
    }

    public DichVuResponse getById(Integer id) {
        return toResponse(findById(id));
    }

    public List<DichVuResponse> getActive() {
        return dichVuRepository.findByTrangThai(true)
                .stream().map(this::toResponse).toList();
    }

    /** Search — không cache (query thay đổi liên tục) */
    public List<DichVuResponse> search(String q) {
        return dichVuRepository.search(q)
                .stream().map(this::toResponse).toList();
    }

    // ─────────────────────────────────────────────────────────────────
    // WRITE — xóa toàn bộ cache dichvu sau mỗi thao tác thay đổi
    // ─────────────────────────────────────────────────────────────────

    @Transactional
    public DichVuResponse create(DichVuRequest request) {
        DichVu dv = new DichVu();
        dv.setTenDichVu(request.getTenDichVu());
        dv.setGia(request.getGia());
        dv.setMoTa(request.getMoTa());
        dv.setHinhAnh(request.getHinhAnh());
        dv.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : true);
        dichVuRepository.save(dv);
        return toResponse(dv);
    }

    @Transactional
    public DichVuResponse update(Integer id, DichVuRequest request) {
        DichVu dv = findById(id);
        dv.setTenDichVu(request.getTenDichVu());
        dv.setGia(request.getGia());
        dv.setMoTa(request.getMoTa());
        dv.setHinhAnh(request.getHinhAnh());
        if (request.getTrangThai() != null) dv.setTrangThai(request.getTrangThai());
        dichVuRepository.save(dv);
        return toResponse(dv);
    }

    @Transactional
    public void delete(Integer id) {
        if (!dichVuRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy dịch vụ");
        }
        dichVuRepository.deleteById(id);
    }

    // ─────────────────────────────────────────────────────────────────
    // Internal helpers
    // ─────────────────────────────────────────────────────────────────

    private DichVu findById(Integer id) {
        return dichVuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));
    }

    public DichVuResponse toResponse(DichVu dv) {
        return new DichVuResponse(
                dv.getMaDV(),
                dv.getTenDichVu(),
                dv.getGia(),
                dv.getMoTa(),
                dv.getHinhAnh(),
                dv.getTrangThai()
        );
    }
}
