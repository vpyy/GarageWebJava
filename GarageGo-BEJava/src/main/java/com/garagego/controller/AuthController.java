package com.garagego.controller;

import com.garagego.dto.auth.AuthResponse;
import com.garagego.dto.auth.LoginRequest;
import com.garagego.dto.auth.RefreshTokenRequest;
import com.garagego.dto.auth.RegisterRequest;
import com.garagego.dto.common.MessageResponse;
import com.garagego.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Đăng nhập — FE gửi plain-text password (không hash nữa).
     * Response: { accessToken, refreshToken, userId, username, email, role }
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Làm mới access token bằng refresh token.
     * Áp dụng rotation: refresh token cũ bị vô hiệu, trả về token mới.
     * Body: { "refreshToken": "uuid..." }
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refresh(request.getRefreshToken()));
    }

    /**
     * Đăng xuất — thu hồi toàn bộ refresh token của user.
     * Body: { "refreshToken": "uuid..." }
     */
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok(MessageResponse.of("Đăng xuất thành công"));
    }

    /**
     * Lấy thông tin user hiện tại.
     * Cần Bearer token hợp lệ (được bảo vệ bởi SecurityConfig).
     */
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getMe(@RequestParam Integer userId) {
        return ResponseEntity.ok(authService.getMe(userId));
    }
}
