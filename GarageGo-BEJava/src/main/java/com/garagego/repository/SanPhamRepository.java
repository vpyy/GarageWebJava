package com.garagego.repository;

import com.garagego.model.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer> {

    // Còn hàng
    List<SanPham> findBySoLuongTonGreaterThan(Integer soLuong);

    // Sắp hết (tồn kho < threshold và > 0)
    @Query("SELECT s FROM SanPham s WHERE s.soLuongTon < :threshold AND s.soLuongTon > 0")
    List<SanPham> findLowStock(@Param("threshold") Integer threshold);

    // Hết hàng
    List<SanPham> findBySoLuongTon(Integer soLuong);

    // Search
    @Query("SELECT s FROM SanPham s WHERE " +
           "LOWER(s.tenSanPham) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.moTa) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<SanPham> search(@Param("q") String q);

    // Count sắp hết (cho ThongKe)
    @Query("SELECT COUNT(s) FROM SanPham s WHERE s.soLuongTon < 10 AND s.soLuongTon > 0")
    long countLowStock();
}
