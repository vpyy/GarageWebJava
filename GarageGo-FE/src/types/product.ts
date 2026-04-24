export interface Product {
  maSP: number;
  tenSP: string;
  donGia: number;
  soLuongTon: number;
  donVi?: string;
  moTa?: string;
  hinhAnh?: string;
}

export interface Service {
  maDV: number;
  tenDV: string;
  donGia: number;
  moTa?: string;
  hinhAnh?: string;
  trangThai: boolean;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  maxQuantity: number;
}

export interface CreateProductRequest {
  tenSP: string;
  donGia: number;
  soLuongTon: number;
  donVi?: string;
  moTa?: string;
  hinhAnh?: string;
}

export interface UpdateProductRequest extends CreateProductRequest {
  maSP: number;
}

export interface CreateServiceRequest {
  tenDV: string;
  donGia: number;
  moTa?: string;
  hinhAnh?: string;
  trangThai: boolean;
}

export interface UpdateServiceRequest extends CreateServiceRequest {
  maDV: number;
}

export interface ServiceRequest {
  maYeuCau: number;
  tenKhachHang: string;
  soDienThoai: string;
  diaChi: string;
  maDV: number;
  ghiChu?: string;
  ngayYeuCau: string;
  ngayHen?: string;
  gioHen?: string;
  trangThai: string;
  dichVu?: Service;
}

export interface CreateServiceRequestRequest {
  tenKhachHang: string;
  soDienThoai: string;
  diaChi: string;
  maDV: number;
  ghiChu?: string;
  ngayHen?: string;
  gioHen?: string;
}
