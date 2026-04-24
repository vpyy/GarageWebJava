package com.garagego.dto.dichvu;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DichVuResponse {
    private Integer maDV;
    private String tenDV;
    private BigDecimal donGia;
    private String moTa;
    private String hinhAnh;
    private Boolean trangThai;
}
