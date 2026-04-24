package com.garagego.controller;

import com.garagego.dto.sanpham.SanPhamCreateRequest;
import com.garagego.dto.sanpham.SanPhamResponse;
import com.garagego.dto.sanpham.SanPhamUpdateRequest;
import com.garagego.service.SanPhamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/san-pham")
@RequiredArgsConstructor
public class SanPhamController {

    private final SanPhamService sanPhamService;

    @GetMapping
    public ResponseEntity<List<SanPhamResponse>> getAll() {
        return ResponseEntity.ok(sanPhamService.getAll());
    }

    @GetMapping("/in-stock")
    public ResponseEntity<List<SanPhamResponse>> getInStock() {
        return ResponseEntity.ok(sanPhamService.getInStock());
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<SanPhamResponse>> getLowStock(
            @RequestParam(defaultValue = "10") Integer threshold) {
        return ResponseEntity.ok(sanPhamService.getLowStock(threshold));
    }

    @GetMapping("/search")
    public ResponseEntity<List<SanPhamResponse>> search(@RequestParam String q) {
        return ResponseEntity.ok(sanPhamService.search(q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SanPhamResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(sanPhamService.getById(id));
    }

    @PostMapping
    public ResponseEntity<SanPhamResponse> create(@Valid @RequestBody SanPhamCreateRequest request) {
        SanPhamResponse response = sanPhamService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SanPhamResponse> update(@PathVariable Integer id,
                                                   @Valid @RequestBody SanPhamUpdateRequest request) {
        return ResponseEntity.ok(sanPhamService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        sanPhamService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
