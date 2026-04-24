package com.garagego.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "YEUCAU_DICHVU")
public class YeucauDichVu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaYeuCau")
    private Integer maYeuCau;

    @Column(name = "TenKhachHang", nullable = false, length = 100)
    private String tenKhachHang;

    @Column(name = "SoDienThoai", nullable = false, length = 20)
    private String soDienThoai;

    @Column(name = "DiaChi", nullable = false, length = 500)
    private String diaChi;

    @Column(name = "MaDV")
    private Integer maDV;

    @Column(name = "GhiChu", length = 1000)
    private String ghiChu;

    @Column(name = "NgayYeuCau")
    private LocalDateTime ngayYeuCau = LocalDateTime.now();

    @Column(name = "TrangThai", length = 20)
    private String trangThai = "Mới";

    @Column(name = "NgayHen")
    private LocalDate ngayHen;

    @Column(name = "GioHen", length = 10)
    private String gioHen;

    @Column(name = "Username", length = 50)
    private String username;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MaDV", insertable = false, updatable = false)
    private DichVu dichVu;
}
