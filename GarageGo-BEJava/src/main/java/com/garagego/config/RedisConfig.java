package com.garagego.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

/**
 * Redis config đã bị tắt — chạy local không cần Redis.
 * Cache dùng simple in-memory (spring.cache.type=simple trong application.properties).
 * Refresh token dùng InMemoryRefreshTokenService.
 *
 * Để bật lại Redis: uncomment RedisConfig.java.bak và xóa file này.
 */
@Configuration
@EnableCaching
public class RedisConfig {
    // Không có bean Redis — Spring Boot tự dùng Simple cache từ application.properties
}
