package com.garagego.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "HOADON")
public class HoaDon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaHD")
    private Integer maHD;

    @Column(name = "MaKH", nullable = false)
    private Integer maKH;

    @Column(name = "MaXe")
    private Integer maXe;

    @Column(name = "UserId")
    private Integer userId;

    @Column(name = "NgayLap")
    private LocalDateTime ngayLap = LocalDateTime.now();

    @Column(name = "TongTien", precision = 18, scale = 2)
    private BigDecimal tongTien = BigDecimal.ZERO;

    @Column(name = "HinhThucTT", length = 50)
    private String hinhThucTT;

    @Column(name = "TrangThai", length = 30)
    private String trangThai = "Chờ xác nhận";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaKH", insertable = false, updatable = false)
    private KhachHang khachHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaXe", insertable = false, updatable = false)
    private Xe xe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserId", insertable = false, updatable = false)
    private User user;

    @OneToMany(mappedBy = "hoaDon", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ChiTietHDDV> chiTietDichVus;

    @OneToMany(mappedBy = "hoaDon", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ChiTietHDSP> chiTietSanPhams;
}
