package com.garagego.service;

import com.garagego.dto.xe.XeRequest;
import com.garagego.dto.xe.XeResponse;
import com.garagego.model.Xe;
import com.garagego.repository.HoaDonRepository;
import com.garagego.repository.XeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class XeService {

    private final XeRepository xeRepository;
    private final HoaDonRepository hoaDonRepository;

    public List<XeResponse> getAll() {
        return xeRepository.findAll()
                .stream().map(this::toResponse).toList();
    }

    public XeResponse getById(Integer id) {
        Xe xe = xeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe"));
        return toResponse(xe);
    }

    public List<XeResponse> getByKhachHang(Integer maKH) {
        return xeRepository.findByMaKH(maKH)
                .stream().map(this::toResponse).toList();
    }

    public XeResponse getByBienSo(String bienSo) {
        Xe xe = xeRepository.findByBienSo(bienSo)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe"));
        return toResponse(xe);
    }

    public List<XeResponse> search(String q) {
        return xeRepository.search(q)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public XeResponse create(XeRequest request) {
        if (xeRepository.existsByBienSo(request.getBienSo())) {
            throw new RuntimeException("Biển số xe đã tồn tại");
        }
        Xe xe = toEntity(request);
        xeRepository.save(xe);
        return toResponse(xe);
    }

    @Transactional
    public XeResponse update(Integer id, XeRequest request) {
        Xe xe = xeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe"));
        if (xeRepository.existsByBienSoAndMaXeNot(request.getBienSo(), id)) {
            throw new RuntimeException("Biển số xe đã tồn tại");
        }
        xe.setBienSo(request.getBienSo());
        xe.setHangXe(request.getHangXe());
        xe.setDoiXe(request.getDoiXe());
        xe.setMauXe(request.getMauXe());
        xe.setMaKH(request.getMaKH());
        xeRepository.save(xe);
        return toResponse(xe);
    }

    @Transactional
    public void delete(Integer id) {
        if (!xeRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy xe");
        }
        if (hoaDonRepository.existsByMaXe(id)) {
            throw new RuntimeException("Không thể xóa xe đã có hóa đơn");
        }
        xeRepository.deleteById(id);
    }

    private Xe toEntity(XeRequest request) {
        Xe xe = new Xe();
        xe.setBienSo(request.getBienSo());
        xe.setHangXe(request.getHangXe());
        xe.setDoiXe(request.getDoiXe());
        xe.setMauXe(request.getMauXe());
        xe.setMaKH(request.getMaKH());
        return xe;
    }

    private XeResponse toResponse(Xe xe) {
        XeResponse.KhachHangInfo khInfo = null;
        if (xe.getKhachHang() != null) {
            var kh = xe.getKhachHang();
            khInfo = new XeResponse.KhachHangInfo(
                    kh.getMaKH(), kh.getTenKH(), kh.getSdt(), kh.getEmail(), kh.getDiaChi()
            );
        }
        return new XeResponse(
                xe.getMaXe(), xe.getBienSo(), xe.getHangXe(),
                xe.getDoiXe(), xe.getMauXe(), xe.getMaKH(), khInfo
        );
    }
}
