package com.garagego.repository;

import com.garagego.model.Xe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface XeRepository extends JpaRepository<Xe, Integer> {

    Optional<Xe> findByBienSo(String bienSo);

    List<Xe> findByMaKH(Integer maKH);

    boolean existsByBienSo(String bienSo);

    boolean existsByBienSoAndMaXeNot(String bienSo, Integer maXe);

    // Search theo biển số, hãng xe
    @Query("SELECT x FROM Xe x WHERE " +
           "LOWER(x.bienSo) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(x.hangXe) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Xe> search(@Param("q") String q);

    boolean existsByMaKH(Integer maKH);
}
