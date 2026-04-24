package com.garagego.dto.lienhe;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LienHeResponse {
    private Integer maLienHe;
    private String hoTen;
    private String email;
    private String soDienThoai;
    private String chuDe;
    private String noiDung;
    private LocalDateTime ngayGui;
    private Boolean daXuLy;
    private String username;
}
