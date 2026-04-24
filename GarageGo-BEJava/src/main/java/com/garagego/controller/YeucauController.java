package com.garagego.controller;

import com.garagego.dto.yeucau.YeucauCreateRequest;
import com.garagego.dto.yeucau.YeucauResponse;
import com.garagego.dto.yeucau.YeucauStatusRequest;
import com.garagego.dto.yeucau.YeucauUpdateRequest;
import com.garagego.service.YeucauService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/yeu-cau")
@RequiredArgsConstructor
public class YeucauController {

    private final YeucauService yeucauService;

    @GetMapping
    public ResponseEntity<List<YeucauResponse>> getAll() {
        return ResponseEntity.ok(yeucauService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<YeucauResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(yeucauService.getById(id));
    }

    @PostMapping
    public ResponseEntity<YeucauResponse> create(@Valid @RequestBody YeucauCreateRequest request) {
        YeucauResponse response = yeucauService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<YeucauResponse> update(@PathVariable Integer id,
                                                  @Valid @RequestBody YeucauUpdateRequest request) {
        return ResponseEntity.ok(yeucauService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<YeucauResponse> updateStatus(@PathVariable Integer id,
                                                        @Valid @RequestBody YeucauStatusRequest request) {
        return ResponseEntity.ok(yeucauService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        yeucauService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
