package com.garagego.repository;

import com.garagego.model.DichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DichVuRepository extends JpaRepository<DichVu, Integer> {

    List<DichVu> findByTrangThai(Boolean trangThai);

    @Query("SELECT d FROM DichVu d WHERE " +
           "LOWER(d.tenDichVu) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(d.moTa) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<DichVu> search(@Param("q") String q);
}
