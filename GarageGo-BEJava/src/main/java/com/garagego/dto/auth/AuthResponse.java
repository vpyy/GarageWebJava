package com.garagego.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    /** JWT access token (ngắn hạn — 24h) */
    private String accessToken;

    /** Refresh token (dài hạn — 7 ngày, lưu trong DB) */
    private String refreshToken;

    private Integer userId;
    private String username;
    private String email;
    private String role;
}

