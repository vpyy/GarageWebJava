package com.garagego.dto.yeucau;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class YeucauResponse {
    private Integer maYeuCau;
    private String tenKhachHang;
    private String soDienThoai;
    private String diaChi;
    private Integer maDV;
    private String ghiChu;
    private LocalDateTime ngayYeuCau;
    private String trangThai;
    private LocalDate ngayHen;
    private String gioHen;
    private String username;
    private DichVuInfo dichVu;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DichVuInfo {
        private Integer id;
        private String tenDichVu;
        private java.math.BigDecimal gia;
        private String moTa;
    }
}
