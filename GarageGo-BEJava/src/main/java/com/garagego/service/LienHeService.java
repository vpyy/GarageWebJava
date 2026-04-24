package com.garagego.service;

import com.garagego.dto.lienhe.LienHeCreateResponse;
import com.garagego.dto.lienhe.LienHeRequest;
import com.garagego.dto.lienhe.LienHeResponse;
import com.garagego.model.LienHe;
import com.garagego.repository.LienHeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LienHeService {

    private final LienHeRepository lienHeRepository;

    public List<LienHeResponse> getAll() {
        return lienHeRepository.findAllByOrderByNgayGuiDesc()
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public LienHeCreateResponse create(LienHeRequest request) {
        LienHe lh = new LienHe();
        lh.setHoTen(request.getHoTen());
        lh.setEmail(request.getEmail());
        lh.setSoDienThoai(request.getSoDienThoai());
        lh.setChuDe(request.getChuDe());
        lh.setNoiDung(request.getNoiDung());
        lh.setNgayGui(LocalDateTime.now());
        lh.setDaXuLy(false);
        lh.setUsername(request.getUsername());
        lienHeRepository.save(lh);
        return new LienHeCreateResponse(lh.getMaLienHe(), "Gửi liên hệ thành công");
    }

    @Transactional
    public LienHeResponse updateStatus(Integer id, Boolean daXuLy) {
        LienHe lh = lienHeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy liên hệ"));
        lh.setDaXuLy(daXuLy);
        lienHeRepository.save(lh);
        return toResponse(lh);
    }

    private LienHeResponse toResponse(LienHe lh) {
        return new LienHeResponse(
                lh.getMaLienHe(),
                lh.getHoTen(),
                lh.getEmail(),
                lh.getSoDienThoai(),
                lh.getChuDe(),
                lh.getNoiDung(),
                lh.getNgayGui(),
                lh.getDaXuLy(),
                lh.getUsername()
        );
    }
}
