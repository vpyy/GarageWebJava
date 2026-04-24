package com.garagego.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "KHACHHANG")
public class KhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaKH")
    private Integer maKH;

    @Column(name = "TenKH", nullable = false, length = 100)
    private String tenKH;

    @Column(name = "SDT", nullable = false, length = 15)
    private String sdt;

    @Column(name = "DiaChi", length = 200)
    private String diaChi;

    @Column(name = "Email", length = 100)
    private String email;

    @Column(name = "NgayDangKy")
    private LocalDateTime ngayDangKy = LocalDateTime.now();

    @Column(name = "UserId")
    private Integer userId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserId", insertable = false, updatable = false)
    private User user;

    @OneToMany(mappedBy = "khachHang", fetch = FetchType.LAZY)
    private List<Xe> danhSachXe;

    @OneToMany(mappedBy = "khachHang", fetch = FetchType.LAZY)
    private List<HoaDon> hoaDons;
}
