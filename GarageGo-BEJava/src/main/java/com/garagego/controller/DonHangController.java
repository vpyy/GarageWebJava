package com.garagego.controller;

import com.garagego.dto.donhang.DonHangCreateRequest;
import com.garagego.dto.donhang.DonHangCreateResponse;
import com.garagego.service.DonHangService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/don-hang")
@RequiredArgsConstructor
public class DonHangController {

    private final DonHangService donHangService;

    @PostMapping
    public ResponseEntity<DonHangCreateResponse> createOrder(
            @Valid @RequestBody DonHangCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails != null) {
            request.setUsername(userDetails.getUsername());
        }
        DonHangCreateResponse result = donHangService.createOrder(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Map<String, Object>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(403).build();
        }
        List<Map<String, Object>> orders = donHangService.getOrdersByUsername(userDetails.getUsername());
        return ResponseEntity.ok(orders);
    }
}
