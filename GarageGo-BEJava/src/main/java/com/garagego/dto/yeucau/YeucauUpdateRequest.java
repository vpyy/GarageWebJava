package com.garagego.dto.yeucau;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class YeucauUpdateRequest {

    @NotBlank(message = "Tên khách hàng không được để trống")
    private String tenKhachHang;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String soDienThoai;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String diaChi;

    @NotNull(message = "Mã dịch vụ không được để trống")
    private Integer maDV;

    private String ghiChu;
    private String trangThai;
    private LocalDate ngayHen;
    private String gioHen;
    private String username;
}
