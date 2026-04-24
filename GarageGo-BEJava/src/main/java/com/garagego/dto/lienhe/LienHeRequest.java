package com.garagego.dto.lienhe;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LienHeRequest {

    @NotBlank(message = "Họ tên không được để trống")
    private String hoTen;

    @NotBlank(message = "Email không được để trống")
    private String email;

    private String soDienThoai;
    private String chuDe;
    private String noiDung;
    private String username;
}
