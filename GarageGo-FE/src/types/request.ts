export interface ServiceRequest {
  maYeuCau: number;
  tenKhachHang: string;
  soDienThoai: string;
  email: string;
  diaChi: string;
  maDV: number;
  ngayYeuCau: string;
  trangThai: string;
  ghiChu?: string;
  username?: string;
  dichVu?: {
    id: number;
    tenDichVu: string;
    gia: number;
    donGia?: number;
    moTa: string;
  };
}

export interface ServiceRequestCreateRequest {
  tenKhachHang: string;
  soDienThoai: string;
  email: string;
  diaChi: string;
  maDV: number;
  ghiChu?: string;
}

export interface ServiceRequestUpdateRequest extends ServiceRequestCreateRequest {
  maYeuCau: number;
  trangThai: string;
}
