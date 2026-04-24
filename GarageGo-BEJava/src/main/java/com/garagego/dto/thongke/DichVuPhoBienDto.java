package com.garagego.dto.thongke;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DichVuPhoBienDto {
    private Integer maDV;
    private String tenDV;
    private long soLuong;
    private long soLanSuDung;
    private BigDecimal doanhThu;
}
