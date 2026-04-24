package com.garagego.dto.donhang;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class DonHangCreateRequest {
    
    @NotBlank(message = "Họ tên không được để trống")
    private String hoTen;
    
    @NotBlank(message = "Số điện thoại không được để trống")
    private String soDienThoai;
    
    @Email(message = "Email không hợp lệ")
    private String email;
    
    private String diaChi;
    private String ghiChu;
    private String phuongThucThanhToan = "COD";
    
    private String username; // username của user đặt hàng (set từ JWT)
    
    @NotEmpty(message = "Danh sách sản phẩm không được để trống")
    @Valid
    private List<SanPhamItem> sanPhams;
    
    private BigDecimal tongTien;

    @Data
    public static class SanPhamItem {
        
        @NotNull(message = "Mã sản phẩm không được để trống")
        private Integer maSP;
        
        @NotNull(message = "Số lượng không được để trống")
        @Positive(message = "Số lượng phải lớn hơn 0")
        private Integer soLuong;
        
        private BigDecimal donGia;
    }
}
