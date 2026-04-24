package com.garagego.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Standard response DTO for simple success messages
 * Replaces Map.of("message", ...) pattern from .NET
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private String message;
    
    public static MessageResponse of(String message) {
        return new MessageResponse(message);
    }
}
