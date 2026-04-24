package com.garagego.dto.yeucau;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class YeucauStatusRequest {

    @NotBlank(message = "Trạng thái không được để trống")
    private String trangThai;
}
