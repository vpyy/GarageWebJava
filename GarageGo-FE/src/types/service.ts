export interface Service {
  maDV: number;
  tenDV: string;
  donGia: number;
  moTa: string;
  hinhAnh?: string;
  trangThai: boolean;
}

export interface ServiceCreateRequest {
  tenDichVu: string;
  gia: number;
  moTa: string;
  hinhAnh?: string;
  trangThai: boolean;
}

export interface ServiceUpdateRequest extends ServiceCreateRequest {
  id: number;
}