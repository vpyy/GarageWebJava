package com.garagego.dto.xe;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class XeResponse {
    private Integer maXe;
    private String bienSo;
    private String hangXe;
    private Integer doiXe;
    private String mauXe;
    private Integer maKH;
    private KhachHangInfo khachHang;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KhachHangInfo {
        private Integer maKH;
        private String tenKH;
        private String sdt;
        private String email;
        private String diaChi;
    }
}
