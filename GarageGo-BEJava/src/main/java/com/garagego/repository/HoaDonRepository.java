package com.garagego.repository;

import com.garagego.model.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {

    List<HoaDon> findAllByOrderByNgayLapDesc();

    // Fetch kèm KhachHang và Xe để tránh LazyInitializationException
    @Query("SELECT h FROM HoaDon h LEFT JOIN FETCH h.khachHang LEFT JOIN FETCH h.xe LEFT JOIN FETCH h.user ORDER BY h.ngayLap DESC")
    List<HoaDon> findAllWithKhachHangAndXe();

    // Fetch đầy đủ cho getById
    @Query("SELECT h FROM HoaDon h LEFT JOIN FETCH h.khachHang LEFT JOIN FETCH h.xe LEFT JOIN FETCH h.user WHERE h.maHD = :id")
    java.util.Optional<HoaDon> findByIdWithDetails(@org.springframework.data.repository.query.Param("id") Integer id);

    // Doanh thu hôm nay
    @Query("SELECT COALESCE(SUM(h.tongTien), 0) FROM HoaDon h WHERE DATE(h.ngayLap) = CURRENT_DATE AND h.trangThai = 'Hoàn thành'")
    BigDecimal sumDoanhThuHomNay();

    // Doanh thu tháng
    @Query("SELECT COALESCE(SUM(h.tongTien), 0) FROM HoaDon h WHERE MONTH(h.ngayLap) = :month AND YEAR(h.ngayLap) = :year AND h.trangThai = 'Hoàn thành'")
    BigDecimal sumDoanhThuThang(@Param("month") int month, @Param("year") int year);

    // Doanh thu năm
    @Query("SELECT COALESCE(SUM(h.tongTien), 0) FROM HoaDon h WHERE YEAR(h.ngayLap) = :year AND h.trangThai = 'Hoàn thành'")
    BigDecimal sumDoanhThuNam(@Param("year") int year);

    // Đếm hóa đơn hôm nay
    @Query("SELECT COUNT(h) FROM HoaDon h WHERE DATE(h.ngayLap) = CURRENT_DATE")
    long countHomNay();

    // Đếm hóa đơn tháng
    @Query("SELECT COUNT(h) FROM HoaDon h WHERE MONTH(h.ngayLap) = :month AND YEAR(h.ngayLap) = :year")
    long countThang(@Param("month") int month, @Param("year") int year);

    // Doanh thu theo tháng trong năm (cho chart)
    @Query("SELECT MONTH(h.ngayLap) as thang, SUM(h.tongTien) as doanhThu, COUNT(h) as soHoaDon " +
           "FROM HoaDon h WHERE YEAR(h.ngayLap) = :year AND h.trangThai = 'Hoàn thành' " +
           "GROUP BY MONTH(h.ngayLap) ORDER BY MONTH(h.ngayLap)")
    List<Object[]> doanhThuTheoThang(@Param("year") int year);

    // Doanh thu theo ngày trong khoảng
    @Query("SELECT DATE(h.ngayLap) as ngay, SUM(h.tongTien) as tongTien, COUNT(h) as soHoaDon " +
           "FROM HoaDon h WHERE h.ngayLap BETWEEN :from AND :to AND h.trangThai = 'Hoàn thành' " +
           "GROUP BY DATE(h.ngayLap) ORDER BY DATE(h.ngayLap)")
    List<Object[]> doanhThuTheoNgay(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    // Hóa đơn gần đây
    @Query("SELECT h FROM HoaDon h LEFT JOIN FETCH h.khachHang LEFT JOIN FETCH h.xe ORDER BY h.ngayLap DESC")
    List<HoaDon> findRecentWithDetails();

    // Tổng doanh thu trong khoảng ngày
    @Query("SELECT COALESCE(SUM(h.tongTien), 0) FROM HoaDon h WHERE h.ngayLap BETWEEN :from AND :to AND h.trangThai = 'Hoàn thành'")
    BigDecimal sumDoanhThuTrongKhoang(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    // Đếm hóa đơn trong khoảng ngày
    @Query("SELECT COUNT(h) FROM HoaDon h WHERE h.ngayLap BETWEEN :from AND :to AND h.trangThai = 'Hoàn thành'")
    long countTrongKhoang(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    boolean existsByMaXe(Integer maXe);

    /**
     * Top khách hàng chi tiêu nhiều nhất.
     * Trả về: [maKH, tenKH, sdt, soHoaDon, tongChiTieu]
     */
    @Query("SELECT h.maKH, k.tenKH, k.sdt, COUNT(h), SUM(h.tongTien) " +
           "FROM HoaDon h JOIN h.khachHang k " +
           "WHERE h.trangThai = 'Hoàn thành' " +
           "GROUP BY h.maKH, k.tenKH, k.sdt " +
           "ORDER BY SUM(h.tongTien) DESC")
    List<Object[]> findTopKhachHang();
}
