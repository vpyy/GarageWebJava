package com.garagego.dto.thongke;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonGanDayDto {
    private Integer maHD;
    private String tenKH;
    private String bienSo;
    private LocalDateTime ngayLap;
    private BigDecimal tongTien;
    private String trangThai;
}
