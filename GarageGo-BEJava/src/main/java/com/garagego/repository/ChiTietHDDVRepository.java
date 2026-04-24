package com.garagego.repository;

import com.garagego.model.ChiTietHDDV;
import com.garagego.model.ChiTietHDDVId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietHDDVRepository extends JpaRepository<ChiTietHDDV, ChiTietHDDVId> {

    List<ChiTietHDDV> findByMaHD(Integer maHD);

    void deleteByMaHD(Integer maHD);

    // Top dịch vụ phổ biến
    @Query("SELECT ct.maDV, ct.dichVu.tenDichVu, SUM(ct.soLuong), COUNT(ct), SUM(ct.thanhTien) " +
           "FROM ChiTietHDDV ct GROUP BY ct.maDV, ct.dichVu.tenDichVu ORDER BY SUM(ct.soLuong) DESC")
    List<Object[]> findTopDichVu();
}
