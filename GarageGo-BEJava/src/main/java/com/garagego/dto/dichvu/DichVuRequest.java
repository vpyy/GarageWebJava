package com.garagego.dto.dichvu;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DichVuRequest {

    @JsonAlias({"TenDichVu", "tenDichVu", "TenDV", "tenDV"})
    @NotBlank(message = "Tên dịch vụ không được để trống")
    private String tenDichVu;

    @JsonAlias({"Gia", "gia", "DonGia", "donGia"})
    @NotNull(message = "Đơn giá không được để trống")
    private BigDecimal gia;

    @JsonAlias({"MoTa", "moTa"})
    private String moTa;

    @JsonAlias({"HinhAnh", "hinhAnh"})
    private String hinhAnh;

    @JsonAlias({"TrangThai", "trangThai"})
    private Boolean trangThai = true;
}
