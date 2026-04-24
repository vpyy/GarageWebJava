package com.garagego.dto.khachhang;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangResponse {
    private Integer maKH;
    private String tenKH;
    private String sdt;
    private String diaChi;
    private String email;
    private LocalDateTime ngayDangKy;
    private Integer userId;
}
