package com.garagego.controller;

import com.garagego.dto.khachhang.KhachHangRequest;
import com.garagego.dto.khachhang.KhachHangResponse;
import com.garagego.model.KhachHang;
import com.garagego.service.KhachHangService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/khach-hang")
@RequiredArgsConstructor
public class KhachHangController {

    private final KhachHangService khachHangService;

    @GetMapping
    public ResponseEntity<List<KhachHangResponse>> getAll() {
        return ResponseEntity.ok(khachHangService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KhachHangResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(khachHangService.getById(id));
    }

    @GetMapping("/sdt/{sdt}")
    public ResponseEntity<KhachHang> getBySdt(@PathVariable String sdt) {
        KhachHang kh = khachHangService.getBySdt(sdt);
        return ResponseEntity.ok(kh);
    }

    @GetMapping("/search")
    public ResponseEntity<List<KhachHangResponse>> search(@RequestParam String q) {
        return ResponseEntity.ok(khachHangService.search(q));
    }

    @PostMapping
    public ResponseEntity<KhachHangResponse> create(@Valid @RequestBody KhachHangRequest request) {
        KhachHangResponse response = khachHangService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KhachHangResponse> update(@PathVariable Integer id,
                                                     @Valid @RequestBody KhachHangRequest request) {
        return ResponseEntity.ok(khachHangService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        khachHangService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
