package com.garagego.service;

import com.garagego.dto.yeucau.YeucauCreateRequest;
import com.garagego.dto.yeucau.YeucauResponse;
import com.garagego.dto.yeucau.YeucauStatusRequest;
import com.garagego.dto.yeucau.YeucauUpdateRequest;
import com.garagego.model.YeucauDichVu;
import com.garagego.repository.YeucauDichVuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class YeucauService {

    private final YeucauDichVuRepository yeucauRepository;

    public List<YeucauResponse> getAll() {
        return yeucauRepository.findAllByOrderByNgayYeuCauDesc()
                .stream().map(this::toResponse).toList();
    }

    public YeucauResponse getById(Integer id) {
        return toResponse(findById(id));
    }

    @Transactional
    public YeucauResponse create(YeucauCreateRequest request) {
        YeucauDichVu yc = new YeucauDichVu();
        yc.setTenKhachHang(request.getTenKhachHang());
        yc.setSoDienThoai(request.getSoDienThoai());
        yc.setDiaChi(request.getDiaChi());
        yc.setMaDV(request.getMaDV());
        yc.setGhiChu(request.getGhiChu());
        yc.setNgayYeuCau(LocalDateTime.now());
        yc.setTrangThai("Mới");
        yc.setNgayHen(request.getNgayHen());
        yc.setGioHen(request.getGioHen());
        yc.setUsername(request.getUsername());
        yeucauRepository.save(yc);
        return toResponse(yc);
    }

    // PUT /api/Yeucau/{id} — update toàn bộ (dùng cho RequestManagement admin)
    @Transactional
    public YeucauResponse update(Integer id, YeucauUpdateRequest request) {
        YeucauDichVu yc = findById(id);
        yc.setTenKhachHang(request.getTenKhachHang());
        yc.setSoDienThoai(request.getSoDienThoai());
        yc.setDiaChi(request.getDiaChi());
        yc.setMaDV(request.getMaDV());
        yc.setGhiChu(request.getGhiChu());
        if (request.getTrangThai() != null) yc.setTrangThai(request.getTrangThai());
        if (request.getNgayHen() != null) yc.setNgayHen(request.getNgayHen());
        if (request.getGioHen() != null) yc.setGioHen(request.getGioHen());
        if (request.getUsername() != null) yc.setUsername(request.getUsername());
        yeucauRepository.save(yc);
        return toResponse(yc);
    }

    // PATCH /api/Yeucau/{id}/status — chỉ update trạng thái
    // Fix endpoint thiếu: FE productService.updateServiceRequestStatus() gọi PATCH
    @Transactional
    public YeucauResponse updateStatus(Integer id, YeucauStatusRequest request) {
        YeucauDichVu yc = findById(id);
        yc.setTrangThai(request.getTrangThai());
        yeucauRepository.save(yc);
        return toResponse(yc);
    }

    @Transactional
    public void delete(Integer id) {
        if (!yeucauRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy yêu cầu");
        }
        yeucauRepository.deleteById(id);
    }

    private YeucauDichVu findById(Integer id) {
        return yeucauRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu"));
    }

    private YeucauResponse toResponse(YeucauDichVu yc) {
        YeucauResponse.DichVuInfo dvInfo = null;
        if (yc.getDichVu() != null) {
            var dv = yc.getDichVu();
            dvInfo = new YeucauResponse.DichVuInfo(
                    dv.getMaDV(), dv.getTenDichVu(), dv.getGia(), dv.getMoTa());
        }
        return new YeucauResponse(
                yc.getMaYeuCau(),
                yc.getTenKhachHang(),
                yc.getSoDienThoai(),
                yc.getDiaChi(),
                yc.getMaDV(),
                yc.getGhiChu(),
                yc.getNgayYeuCau(),
                yc.getTrangThai(),
                yc.getNgayHen(),
                yc.getGioHen(),
                yc.getUsername(),
                dvInfo
        );
    }
}
