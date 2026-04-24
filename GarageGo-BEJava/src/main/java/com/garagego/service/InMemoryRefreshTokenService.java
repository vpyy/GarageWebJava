package com.garagego.service;

import com.garagego.model.User;
import com.garagego.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Thay thế RedisRefreshTokenService khi không có Redis.
 * Lưu refresh token trong bộ nhớ (ConcurrentHashMap).
 * Lưu ý: Token bị mất khi restart server — phù hợp cho development.
 */
@Service
@RequiredArgsConstructor
public class InMemoryRefreshTokenService {

    private final UserRepository userRepository;

    @Value("${jwt.refresh-expiration-ms}")
    private long refreshExpMs;

    // token → userId
    private final Map<String, String> tokenStore = new ConcurrentHashMap<>();
    // userId → Set<token>
    private final Map<String, Set<String>> userTokens = new ConcurrentHashMap<>();

    public String createRefreshToken(User user) {
        String token = UUID.randomUUID().toString();
        String userId = user.getUserId().toString();

        tokenStore.put(token, userId);
        userTokens.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet()).add(token);

        return token;
    }

    public String rotateRefreshToken(String oldToken) {
        String userId = tokenStore.remove(oldToken);
        if (userId == null) {
            throw new RuntimeException("Refresh token không hợp lệ hoặc đã hết hạn, vui lòng đăng nhập lại");
        }

        Set<String> tokens = userTokens.get(userId);
        if (tokens != null) tokens.remove(oldToken);

        User user = userRepository.findById(Integer.parseInt(userId))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        return createRefreshToken(user);
    }

    public User getUserFromToken(String token) {
        String userId = tokenStore.get(token);
        if (userId == null) {
            throw new RuntimeException("Refresh token không hợp lệ hoặc đã hết hạn");
        }
        return userRepository.findById(Integer.parseInt(userId))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
    }

    public void revokeToken(String token) {
        String userId = tokenStore.remove(token);
        if (userId != null) {
            Set<String> tokens = userTokens.get(userId);
            if (tokens != null) tokens.remove(token);
        }
    }

    public void revokeAllUserTokens(User user) {
        String userId = user.getUserId().toString();
        Set<String> tokens = userTokens.remove(userId);
        if (tokens != null) {
            tokens.forEach(tokenStore::remove);
        }
    }
}
