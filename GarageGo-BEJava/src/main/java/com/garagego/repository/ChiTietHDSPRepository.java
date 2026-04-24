package com.garagego.repository;

import com.garagego.model.ChiTietHDSP;
import com.garagego.model.ChiTietHDSPId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietHDSPRepository extends JpaRepository<ChiTietHDSP, ChiTietHDSPId> {

    List<ChiTietHDSP> findByMaHD(Integer maHD);

    void deleteByMaHD(Integer maHD);

    // Top sản phẩm bán chạy
    @Query("SELECT ct.maSP, ct.sanPham.tenSanPham, SUM(ct.soLuong), SUM(ct.thanhTien) " +
           "FROM ChiTietHDSP ct GROUP BY ct.maSP, ct.sanPham.tenSanPham ORDER BY SUM(ct.soLuong) DESC")
    List<Object[]> findTopSanPham();
}
