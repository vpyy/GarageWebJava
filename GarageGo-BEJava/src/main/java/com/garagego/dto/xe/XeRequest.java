package com.garagego.dto.xe;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class XeRequest {

    @NotBlank(message = "Biển số không được để trống")
    private String bienSo;

    private String hangXe;
    private Integer doiXe;
    private String mauXe;

    @NotNull(message = "Mã khách hàng không được để trống")
    private Integer maKH;
}
