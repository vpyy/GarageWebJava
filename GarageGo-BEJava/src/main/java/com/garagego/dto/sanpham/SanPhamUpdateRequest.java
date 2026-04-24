package com.garagego.dto.sanpham;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

/**
 * FE gửi: { Id, TenSanPham, Gia, SoLuongTon, DonVi, MoTa, HinhAnh }
 */
@Data
public class SanPhamUpdateRequest {

    @JsonAlias({"Id", "id", "MaSP", "maSP"})
    private Integer id;

    @JsonAlias({"TenSanPham", "tenSanPham", "tenSP"})
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String tenSanPham;

    @JsonAlias({"Gia", "gia", "DonGia", "donGia"})
    @NotNull(message = "Đơn giá không được để trống")
    private BigDecimal gia;

    @JsonAlias({"SoLuongTon", "soLuongTon"})
    @PositiveOrZero
    private Integer soLuongTon = 0;

    @JsonAlias({"DonVi", "donVi"})
    private String donVi;

    @JsonAlias({"MoTa", "moTa"})
    private String moTa;

    @JsonAlias({"HinhAnh", "hinhAnh"})
    private String hinhAnh;
}
