package com.garagego.controller;

import com.garagego.dto.xe.XeRequest;
import com.garagego.dto.xe.XeResponse;
import com.garagego.service.XeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/xe")
@RequiredArgsConstructor
public class XeController {

    private final XeService xeService;

    @GetMapping
    public ResponseEntity<List<XeResponse>> getAll() {
        return ResponseEntity.ok(xeService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<XeResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(xeService.getById(id));
    }

    @GetMapping("/customer/{maKH}")
    public ResponseEntity<List<XeResponse>> getByKhachHang(@PathVariable Integer maKH) {
        return ResponseEntity.ok(xeService.getByKhachHang(maKH));
    }

    @GetMapping("/bien-so/{bienSo}")
    public ResponseEntity<XeResponse> getByBienSo(@PathVariable String bienSo) {
        return ResponseEntity.ok(xeService.getByBienSo(bienSo));
    }

    @GetMapping("/search")
    public ResponseEntity<List<XeResponse>> search(@RequestParam String q) {
        return ResponseEntity.ok(xeService.search(q));
    }

    @PostMapping
    public ResponseEntity<XeResponse> create(@Valid @RequestBody XeRequest request) {
        XeResponse response = xeService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<XeResponse> update(@PathVariable Integer id,
                                              @Valid @RequestBody XeRequest request) {
        return ResponseEntity.ok(xeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        xeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
