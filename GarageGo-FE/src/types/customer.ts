export interface Customer {
  maKH: number;
  tenKH: string;
  sdt: string;
  diaChi?: string;
  email?: string;
  ngayDangKy: string;
  userId?: number;
  danhSachXe?: Vehicle[];
}

export interface Vehicle {
  maXe: number;
  bienSo: string;
  hangXe?: string;
  doiXe?: number;
  mauXe?: string;
  maKH: number;
  khachHang?: Customer;
}

export interface CreateCustomerRequest {
  tenKH: string;
  sdt: string;
  diaChi?: string;
  email?: string;
  userId?: number;
}

export interface UpdateCustomerRequest extends CreateCustomerRequest {
  maKH: number;
}

export interface CreateVehicleRequest {
  bienSo: string;
  hangXe?: string;
  doiXe?: number;
  mauXe?: string;
  maKH: number;
}

export interface UpdateVehicleRequest extends CreateVehicleRequest {
  maXe: number;
}