package com.garagego.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "XE")
public class Xe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaXe")
    private Integer maXe;

    @Column(name = "BienSo", nullable = false, unique = true, length = 20)
    private String bienSo;

    @Column(name = "HangXe", length = 50)
    private String hangXe;

    @Column(name = "DoiXe")
    private Integer doiXe;

    @Column(name = "MauXe", length = 30)
    private String mauXe;

    @Column(name = "MaKH", nullable = false)
    private Integer maKH;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaKH", insertable = false, updatable = false)
    private KhachHang khachHang;
}
