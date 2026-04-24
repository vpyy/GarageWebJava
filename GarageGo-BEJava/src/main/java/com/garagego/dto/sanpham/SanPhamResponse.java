package com.garagego.dto.sanpham;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SanPhamResponse {
    private Integer maSP;
    private String tenSP;
    private BigDecimal donGia;
    private String moTa;
    private String hinhAnh;
    private Integer soLuongTon;
    private String donVi;
}
