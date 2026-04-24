package com.garagego.repository;

import com.garagego.model.YeucauDichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YeucauDichVuRepository extends JpaRepository<YeucauDichVu, Integer> {

    List<YeucauDichVu> findAllByOrderByNgayYeuCauDesc();

    long countByTrangThai(String trangThai);
}
