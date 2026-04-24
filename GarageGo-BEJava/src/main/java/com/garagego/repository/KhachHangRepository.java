package com.garagego.repository;

import com.garagego.model.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Integer> {

    Optional<KhachHang> findBySdt(String sdt);

    // Tìm theo SDT kèm danh sách xe, lấy mới nhất
    @Query("SELECT k FROM KhachHang k LEFT JOIN FETCH k.danhSachXe WHERE k.sdt = :sdt ORDER BY k.maKH DESC")
    List<KhachHang> findBySdtWithXe(@Param("sdt") String sdt);

    // Search theo tên, sdt, email
    @Query("SELECT k FROM KhachHang k WHERE " +
           "LOWER(k.tenKH) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "k.sdt LIKE CONCAT('%', :q, '%') OR " +
           "LOWER(k.email) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<KhachHang> search(@Param("q") String q);
}
