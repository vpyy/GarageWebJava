package com.garagego.dto.thongke;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangTopDto {
    private Integer maKH;
    private String tenKH;
    private String sdt;
    private long soHoaDon;
    private long soLanSuDung;
    private BigDecimal tongChiTieu;
}
