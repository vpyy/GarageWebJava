package com.garagego.dto.thongke;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoanhThuNgayDto {
    private LocalDate ngay;
    private BigDecimal tongTien;
    private long soHoaDon;
}
