package com.garagego.service;

import com.garagego.dto.auth.AuthResponse;
import com.garagego.dto.auth.LoginRequest;
import com.garagego.dto.auth.RegisterRequest;
import com.garagego.model.User;
import com.garagego.repository.UserRepository;
import com.garagego.security.UserDetailsServiceImpl;
import com.garagego.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final InMemoryRefreshTokenService redisRefreshTokenService;  // ← In-memory thay Redis
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    // ─────────────────────────────────────────────────────────────────
    // Login
    // ─────────────────────────────────────────────────────────────────

    /**
     * Login bằng username + password (plain-text từ FE).
     * BCrypt.matches() so sánh với hash trong DB.
     */
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập hoặc mật khẩu không đúng"));

        if (!user.getIsActive()) {
            throw new RuntimeException("Tài khoản đã bị vô hiệu hóa");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không đúng");
        }

        return buildAuthResponse(user);
    }

    // ─────────────────────────────────────────────────────────────────
    // Register
    // ─────────────────────────────────────────────────────────────────

    /**
     * Đăng ký tài khoản mới.
     * Password từ FE là plain-text, BE hash BCrypt trước khi lưu.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole("Customer");
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);
        return buildAuthResponse(user);
    }

    // ─────────────────────────────────────────────────────────────────
    // Refresh Token
    // ─────────────────────────────────────────────────────────────────

    /**
     * Dùng refresh token để lấy access token mới.
     * Áp dụng rotation: refresh token cũ bị xóa khỏi Redis, token mới được tạo.
     */
    public AuthResponse refresh(String rawRefreshToken) {
        // Rotate: xóa token cũ → tạo token mới trong Redis
        String newRefreshToken = redisRefreshTokenService.rotateRefreshToken(rawRefreshToken);

        // Lấy user từ token mới vừa tạo
        User user = redisRefreshTokenService.getUserFromToken(newRefreshToken);
        var userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String newAccessToken = jwtUtil.generateAccessToken(userDetails);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    // ─────────────────────────────────────────────────────────────────
    // Logout
    // ─────────────────────────────────────────────────────────────────

    /**
     * Thu hồi tất cả refresh token của user trong Redis (đăng xuất mọi thiết bị).
     */
    public void logout(String rawRefreshToken) {
        User user = redisRefreshTokenService.getUserFromToken(rawRefreshToken);
        redisRefreshTokenService.revokeAllUserTokens(user);
    }

    // ─────────────────────────────────────────────────────────────────
    // Get current user
    // ─────────────────────────────────────────────────────────────────

    public AuthResponse getMe(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        return AuthResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    // ─────────────────────────────────────────────────────────────────
    // Internal helper
    // ─────────────────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(User user) {
        var userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String accessToken  = jwtUtil.generateAccessToken(userDetails);
        String refreshToken = redisRefreshTokenService.createRefreshToken(user);  // ← lưu Redis

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
