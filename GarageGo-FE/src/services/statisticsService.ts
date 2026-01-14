import { apiService } from './api';
import {
  TongQuanDto,
  DashboardDto,
  DoanhThuTheoThangDto,
  DoanhThuTheoNgayResponse,
  DichVuPhoBienDto,
  SanPhamPhoBienDto,
  HoaDonGanDayDto,
  KhachHangTopDto
} from '../types/statistics';

export class StatisticsService {
  // Tổng quan
  async getTongQuan(): Promise<TongQuanDto> {
    return await apiService.get<TongQuanDto>('/ThongKe/TongQuan');
  }

  // Dashboard tổng hợp
  async getDashboard(): Promise<DashboardDto> {
    return await apiService.get<DashboardDto>('/ThongKe/Dashboard');
  }

  // Doanh thu theo tháng
  async getDoanhThuTheoThang(): Promise<DoanhThuTheoThangDto[]> {
    return await apiService.get<DoanhThuTheoThangDto[]>('/ThongKe/DoanhThuTheoThang');
  }

  // Doanh thu theo ngày
  async getDoanhThuTheoNgay(fromDate?: string, toDate?: string): Promise<DoanhThuTheoNgayResponse> {
    let url = '/ThongKe/DoanhThuTheoNgay';
    const params = new URLSearchParams();
    
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return await apiService.get<DoanhThuTheoNgayResponse>(url);
  }

  // Top dịch vụ phổ biến
  async getTopDichVu(top: number = 5): Promise<DichVuPhoBienDto[]> {
    return await apiService.get<DichVuPhoBienDto[]>(`/ThongKe/TopDichVu?top=${top}`);
  }

  // Top sản phẩm bán chạy
  async getTopSanPham(top: number = 5): Promise<SanPhamPhoBienDto[]> {
    return await apiService.get<SanPhamPhoBienDto[]>(`/ThongKe/TopSanPham?top=${top}`);
  }

  // Hóa đơn gần đây
  async getHoaDonGanDay(soLuong: number = 10): Promise<HoaDonGanDayDto[]> {
    return await apiService.get<HoaDonGanDayDto[]>(`/ThongKe/HoaDonGanDay?soLuong=${soLuong}`);
  }

  // Top khách hàng
  async getTopKhachHang(top: number = 10): Promise<KhachHangTopDto[]> {
    return await apiService.get<KhachHangTopDto[]>(`/ThongKe/TopKhachHang?top=${top}`);
  }
}

export const statisticsService = new StatisticsService();