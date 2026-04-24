export interface Invoice {
  maHD: number;
  maKH: number;
  maXe: number;
  userId: number;
  ngayLap: string;
  tongTien: number;
  hinhThucTT: string;
  trangThai: string;
  username?: string;
  khachHang?: {
    maKH: number;
    tenKH: string;
    sdt: string;
    email: string;
    diaChi: string;
  };
  xe?: {
    maXe: number;
    bienSo: string;
    hangXe?: string;
    doiXe?: number;
    mauXe?: string;
  };
  user?: {
    id: number;
    username: string;
    email: string;
  };
  chiTietDichVus?: InvoiceServiceDetail[];
  chiTietSanPhams?: InvoiceProductDetail[];
}

export interface InvoiceServiceDetail {
  maHD: number;
  maDV: number;
  soLuong: number;
  donGia: number;
  thanhTien: number;
  dichVu?: {
    id: number;
    tenDichVu: string;
    gia: number;
    moTa?: string;
    hinhAnh?: string;
  };
}

export interface InvoiceProductDetail {
  maHD: number;
  maSP: number;
  soLuong: number;
  donGia: number;
  thanhTien: number;
  sanPham?: {
    maSP: number;
    tenSanPham: string;
    gia: number;
    moTa?: string;
    hinhAnh?: string;
  };
}

export interface InvoiceCreateRequest {
  maKH: number;
  maXe: number;
  userId: number;
  hinhThucTT: string;
  trangThai?: string;
  username?: string;
  dichVus?: Array<{
    maDV: number;
    soLuong: number;
  }>;
  sanPhams?: Array<{
    maSP: number;
    soLuong: number;
  }>;
}
