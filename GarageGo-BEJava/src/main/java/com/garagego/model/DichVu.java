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
@Table(name = "DICHVU")
public class DichVu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaDV")
    private Integer maDV;

    @Column(name = "TenDV", nullable = false, length = 100)
    private String tenDichVu;

    @Column(name = "MoTa", length = 500)
    private String moTa;

    @Column(name = "HinhAnh", length = 255)
    private String hinhAnh;

    @Column(name = "DonGia", nullable = false, precision = 18, scale = 2)
    private BigDecimal gia;

    @Column(name = "TrangThai")
    private Boolean trangThai = true;
}
