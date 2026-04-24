package com.garagego.controller;

import com.garagego.dto.dichvu.DichVuRequest;
import com.garagego.dto.dichvu.DichVuResponse;
import com.garagego.service.DichVuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dich-vu")
@RequiredArgsConstructor
public class DichVuController {

    private final DichVuService dichVuService;

    @GetMapping
    public ResponseEntity<List<DichVuResponse>> getAll() {
        return ResponseEntity.ok(dichVuService.getAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<DichVuResponse>> getActive() {
        return ResponseEntity.ok(dichVuService.getActive());
    }

    @GetMapping("/search")
    public ResponseEntity<List<DichVuResponse>> search(@RequestParam String q) {
        return ResponseEntity.ok(dichVuService.search(q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DichVuResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(dichVuService.getById(id));
    }

    @PostMapping
    public ResponseEntity<DichVuResponse> create(@Valid @RequestBody DichVuRequest request) {
        DichVuResponse response = dichVuService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DichVuResponse> update(@PathVariable Integer id,
                                                  @Valid @RequestBody DichVuRequest request) {
        return ResponseEntity.ok(dichVuService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        dichVuService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
