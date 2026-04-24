package com.garagego.dto.lienhe;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for contact creation
 * Replaces Map.of("maLienHe", ..., "message", ...) pattern
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LienHeCreateResponse {
    private Integer maLienHe;
    private String message;
}
