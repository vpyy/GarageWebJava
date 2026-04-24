package com.garagego.dto.donhang;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Response DTO for order creation
 * Replaces Map.of("success", ..., "message", ...) pattern from .NET
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonHangCreateResponse {
    private Boolean success;
    private String message;
    private Integer orderId;
    private BigDecimal totalAmount;
}
