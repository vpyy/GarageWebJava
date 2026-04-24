package com.garagego.service;

import com.garagego.model.User;
import com.garagego.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * Quản lý Refresh Token lưu trong Redis thay vì MySQL.
 * CHỈ ACTIVE khi profile "redis" được bật.
 * Mặc định dùng InMemoryRefreshTokenService.
 */
@Service
@Profile("redis")  // ← Chỉ load khi chạy với --spring.profiles.active=redis
@RequiredArgsConstructor
public class RedisRefreshTokenService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final UserRepository userRepository;

    @Value("${jwt.refresh-expiration-ms}")
    private long refreshExpMs;

    private static final String TOKEN_PREFIX    = "rt:";
    private static final String USER_SET_PREFIX = "rt_user:";

    // ─────────────────────────────────────────────────────────────────
    // Tạo refresh token mới
    // ─────────────────────────────────────────────────────────────────

    public String createRefreshToken(User user) {
        String token = UUID.randomUUID().toString();
        long ttlSeconds = refreshExpMs / 1000;

        // Lưu token → userId với TTL tự động xóa khi hết hạn
        redisTemplate.opsForValue().set(
                TOKEN_PREFIX + token,
                user.getUserId().toString(),
                ttlSeconds, TimeUnit.SECONDS
        );

        // Thêm token vào set của user (để revoke all khi logout)
        redisTemplate.opsForSet().add(USER_SET_PREFIX + user.getUserId(), token);
        redisTemplate.expire(USER_SET_PREFIX + user.getUserId(), ttlSeconds, TimeUnit.SECONDS);

        return token;
    }

    // ─────────────────────────────────────────────────────────────────
    // Validate + Rotate (dùng cho /refresh)
    // ─────────────────────────────────────────────────────────────────

    /**
     * Kiểm tra token hợp lệ, xóa token cũ (rotation), tạo token mới.
     * @return token mới
     */
    public String rotateRefreshToken(String oldToken) {
        String key = TOKEN_PREFIX + oldToken;
        Object userIdObj = redisTemplate.opsForValue().get(key);

        if (userIdObj == null) {
            throw new RuntimeException("Refresh token không hợp lệ hoặc đã hết hạn, vui lòng đăng nhập lại");
        }

        Integer userId = Integer.parseInt(userIdObj.toString());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        // Xóa token cũ (rotation — chống replay attack)
        redisTemplate.delete(key);
        redisTemplate.opsForSet().remove(USER_SET_PREFIX + userId, oldToken);

        // Tạo và trả về token mới
        return createRefreshToken(user);
    }

    /**
     * Lấy User từ token (không rotate) — dùng cho logout.
     */
    public User getUserFromToken(String token) {
        Object userIdObj = redisTemplate.opsForValue().get(TOKEN_PREFIX + token);
        if (userIdObj == null) {
            throw new RuntimeException("Refresh token không hợp lệ hoặc đã hết hạn");
        }
        Integer userId = Integer.parseInt(userIdObj.toString());
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
    }

    // ─────────────────────────────────────────────────────────────────
    // Revoke (logout)
    // ─────────────────────────────────────────────────────────────────

    /**
     * Thu hồi token cụ thể (logout đơn).
     */
    public void revokeToken(String token) {
        Object userIdObj = redisTemplate.opsForValue().get(TOKEN_PREFIX + token);
        if (userIdObj != null) {
            String userId = userIdObj.toString();
            redisTemplate.delete(TOKEN_PREFIX + token);
            redisTemplate.opsForSet().remove(USER_SET_PREFIX + userId, token);
        }
    }

    /**
     * Thu hồi TẤT CẢ token của user (logout tất cả thiết bị).
     */
    public void revokeAllUserTokens(User user) {
        String userSetKey = USER_SET_PREFIX + user.getUserId();
        Set<Object> tokens = redisTemplate.opsForSet().members(userSetKey);

        if (tokens != null && !tokens.isEmpty()) {
            // Xóa từng token key
            tokens.forEach(token ->
                redisTemplate.delete(TOKEN_PREFIX + token.toString())
            );
        }

        // Xóa set của user
        redisTemplate.delete(userSetKey);
    }
}
