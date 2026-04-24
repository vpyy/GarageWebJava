package com.garagego.dto.khachhang;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class KhachHangRequest {

    @NotBlank(message = "Tên khách hàng không được để trống")
    private String tenKH;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String sdt;

    private String diaChi;
    private String email;
    private Integer userId;
}
