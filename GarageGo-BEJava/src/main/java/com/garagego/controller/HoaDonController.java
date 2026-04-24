package com.garagego.controller;

import com.garagego.dto.hoadon.HoaDonCreateRequest;
import com.garagego.dto.hoadon.HoaDonResponse;
import com.garagego.service.HoaDonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hoa-don")
@RequiredArgsConstructor
public class HoaDonController {

    private final HoaDonService hoaDonService;

    @GetMapping
    public ResponseEntity<List<HoaDonResponse>> getAll() {
        return ResponseEntity.ok(hoaDonService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HoaDonResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(hoaDonService.getById(id));
    }

    @PostMapping
    public ResponseEntity<HoaDonResponse> create(@Valid @RequestBody HoaDonCreateRequest request) {
        HoaDonResponse response = hoaDonService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Void> complete(@PathVariable Integer id) {
        hoaDonService.complete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        hoaDonService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
