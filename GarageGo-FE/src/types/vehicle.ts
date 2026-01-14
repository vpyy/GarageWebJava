export interface Vehicle {
  maXe: number;
  bienSo: string;
  hangXe?: string;
  doiXe?: number;
  mauXe?: string;
  maKH: number;
  khachHang?: {
    maKH: number;
    tenKH: string;
    sdt: string;
    email: string;
    diaChi: string;
  };
}

export interface VehicleCreateRequest {
  bienSo: string;
  hangXe?: string;
  doiXe?: number;
  mauXe?: string;
  maKH: number;
}

export interface VehicleUpdateRequest extends VehicleCreateRequest {
  maXe: number;
}