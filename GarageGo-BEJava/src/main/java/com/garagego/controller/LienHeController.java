package com.garagego.controller;

import com.garagego.dto.lienhe.LienHeCreateResponse;
import com.garagego.dto.lienhe.LienHeRequest;
import com.garagego.dto.lienhe.LienHeResponse;
import com.garagego.service.LienHeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lien-he")
@RequiredArgsConstructor
public class LienHeController {

    private final LienHeService lienHeService;

    @GetMapping
    public ResponseEntity<List<LienHeResponse>> getAll() {
        return ResponseEntity.ok(lienHeService.getAll());
    }

    @PostMapping
    public ResponseEntity<LienHeCreateResponse> create(@Valid @RequestBody LienHeRequest request) {
        LienHeCreateResponse result = lienHeService.create(request);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/update-status")
    public ResponseEntity<LienHeResponse> updateStatus(@RequestParam Integer id,
                                                        @RequestParam boolean daxuly) {
        LienHeResponse result = lienHeService.updateStatus(id, daxuly);
        return ResponseEntity.ok(result);
    }
}
