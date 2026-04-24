package com.garagego.dto.hoadon;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Data
public class HoaDonCreateRequest {
    
    @NotNull(message = "Mã khách hàng không được để trống")
    private Integer maKH;
    
    private Integer maXe;
    private Integer userId;
    private String hinhThucTT;
    private String trangThai;
    private String username;
    
    @Valid
    private List<DichVuItem> dichVus;
    
    @Valid
    private List<SanPhamItem> sanPhams;

    @Data
    public static class DichVuItem {
        
        @NotNull(message = "Mã dịch vụ không được để trống")
        private Integer maDV;
        
        @NotNull(message = "Số lượng không được để trống")
        @Positive(message = "Số lượng phải lớn hơn 0")
        private Integer soLuong;
    }

    @Data
    public static class SanPhamItem {
        
        @NotNull(message = "Mã sản phẩm không được để trống")
        private Integer maSP;
        
        @NotNull(message = "Số lượng không được để trống")
        @Positive(message = "Số lượng phải lớn hơn 0")
        private Integer soLuong;
    }
}
