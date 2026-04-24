package com.garagego.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "SANPHAM")
public class SanPham {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaSP")
    private Integer maSP;

    @Column(name = "TenSP", nullable = false, length = 100)
    private String tenSanPham;

    @Column(name = "MoTa", length = 500)
    private String moTa;

    @Column(name = "HinhAnh", length = 255)
    private String hinhAnh;

    @Column(name = "DonGia", nullable = false, precision = 18, scale = 2)
    private BigDecimal gia;

    @Column(name = "DonVi", length = 20)
    private String donVi;

    @Column(name = "SoLuongTon")
    private Integer soLuongTon = 0;
}
