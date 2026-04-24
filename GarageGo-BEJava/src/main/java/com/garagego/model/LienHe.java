package com.garagego.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "LIENHE")
public class LienHe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaLienHe")
    private Integer maLienHe;

    @Column(name = "HoTen", nullable = false, length = 100)
    private String hoTen;

    @Column(name = "Email", nullable = false, length = 100)
    private String email;

    @Column(name = "SoDienThoai", length = 20)
    private String soDienThoai;

    @Column(name = "ChuDe", length = 200)
    private String chuDe;

    @Column(name = "NoiDung", length = 2000)
    private String noiDung;

    @Column(name = "NgayGui")
    private LocalDateTime ngayGui = LocalDateTime.now();

    @Column(name = "DaXuLy")
    private Boolean daXuLy = false;

    @Column(name = "Username", length = 50)
    private String username;
}
