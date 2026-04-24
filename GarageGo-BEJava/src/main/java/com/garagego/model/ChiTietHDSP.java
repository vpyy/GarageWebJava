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
@Table(name = "CHITIET_HDSP")
@IdClass(ChiTietHDSPId.class)
public class ChiTietHDSP {

    @Id
    @Column(name = "MaHD")
    private Integer maHD;

    @Id
    @Column(name = "MaSP")
    private Integer maSP;

    @Column(name = "SoLuong")
    private Integer soLuong;

    @Column(name = "DonGia", precision = 18, scale = 2)
    private BigDecimal donGia;

    @Column(name = "ThanhTien", precision = 18, scale = 2)
    private BigDecimal thanhTien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaHD", insertable = false, updatable = false)
    private HoaDon hoaDon;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MaSP", insertable = false, updatable = false)
    private SanPham sanPham;
}
