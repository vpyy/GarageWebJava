package com.garagego.repository;

import com.garagego.model.LienHe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LienHeRepository extends JpaRepository<LienHe, Integer> {

    List<LienHe> findAllByOrderByNgayGuiDesc();
}
