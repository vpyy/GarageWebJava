package com.garagego.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietHDDVId implements Serializable {
    private Integer maHD;
    private Integer maDV;
}
