package com.garagego.dto.thongke;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SanPhamPhoBienDto {
    private Integer maSP;
    private String tenSP;
    private long soLuong;
    private long soLuongBan;
    private BigDecimal doanhThu;
}
