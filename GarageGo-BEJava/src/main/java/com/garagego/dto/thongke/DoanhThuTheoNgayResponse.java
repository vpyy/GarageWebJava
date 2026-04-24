package com.garagego.dto.thongke;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoanhThuTheoNgayResponse {
    private BigDecimal tongDoanhThu;
    private long tongHoaDon;
    private List<DoanhThuNgayDto> chiTiet;
}
