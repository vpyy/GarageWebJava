export interface TongQuanDto {
  tongKhachHang: number;
  tongXe: number;
  tongHoaDon: number;
  tongDichVu: number;
  tongSanPham: number;
  doanhThuHomNay: number;
  doanhThuThang: number;
  doanhThuThangNay: number;
  doanhThuNam: number;
  soHoaDonHomNay: number;
  soHoaDonThang: number;
  soHoaDonThangNay: number;
  sanPhamSapHet: number;
  hoaDonThang: number;
  yeuCauDangXuLy: number;
}

export interface DashboardDto {
  tongKhachHang: number;
  tongXe: number;
  tongHoaDon: number;
  tongDichVu: number;
  tongSanPham: number;
  doanhThuThang: number;
  doanhThuNam: number;
  doanhThuHomNay: number;
  doanhThuThangNay: number;
  soHoaDonHomNay: number;
  soHoaDonThangNay: number;
  sanPhamSapHet: number;
  doanhThuTheoThang: DoanhThuTheoThangDto[];
  dichVuPhoBien?: DichVuPhoBienDto[];
  topDichVu: DichVuPhoBienDto[];
  topSanPham: SanPhamPhoBienDto[];
  hoaDonGanDay: HoaDonGanDayDto[];
  topKhachHang: KhachHangTopDto[];
}

export interface DoanhThuTheoThangDto {
  thang: number;
  nam: number;
  doanhThu: number;
  soHoaDon: number;
}

export interface DichVuPhoBienDto {
  maDV: number;
  tenDV: string;
  soLanSuDung: number;
  soLuong: number;
  doanhThu: number;
}

export interface SanPhamPhoBienDto {
  maSP: number;
  tenSP: string;
  soLuongBan: number;
  soLuong: number;
  doanhThu: number;
}

export interface HoaDonGanDayDto {
  maHD: number;
  tenKH: string;
  bienSo: string;
  ngayLap: string;
  tongTien: number;
  trangThai?: string;
}

export interface KhachHangTopDto {
  maKH: number;
  tenKH: string;
  sdt?: string;
  soHoaDon: number;
  soLanSuDung: number;
  tongChiTieu: number;
}

export interface DoanhThuTheoNgayResponse {
  tongDoanhThu: number;
  tongHoaDon: number;
  chiTiet: DoanhThuNgayDto[];
}

export interface DoanhThuNgayDto {
  ngay: string;
  tongTien: number;
  soHoaDon: number;
}
