import { apiService } from './api';
import {
  TongQuanDto,
  DashboardDto,
  DoanhThuTheoThangDto,
  DoanhThuTheoNgayResponse,
  DichVuPhoBienDto,
  SanPhamPhoBienDto,
  HoaDonGanDayDto,
  KhachHangTopDto,
} from '../types/statistics';

export class StatisticsService {
  // Tổng quan
  async getTongQuan(): Promise<TongQuanDto> {
    return await apiService.get<TongQuanDto>('/thong-ke/tong-quan');
  }

  // Dashboard tổng hợp
  async getDashboard(): Promise<DashboardDto> {
    return await apiService.get<DashboardDto>('/thong-ke/dashboard');
  }

  // Doanh thu theo tháng
  async getDoanhThuTheoThang(): Promise<DoanhThuTheoThangDto[]> {
    return await apiService.get<DoanhThuTheoThangDto[]>(
      '/thong-ke/doanh-thu-theo-thang'
    );
  }

  // Doanh thu theo ngày
  async getDoanhThuTheoNgay(
    fromDate?: string,
    toDate?: string
  ): Promise<DoanhThuTheoNgayResponse> {
    let url = '/thong-ke/doanh-thu-theo-ngay';
    const params = new URLSearchParams();

    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return await apiService.get<DoanhThuTheoNgayResponse>(url);
  }

  // Top dịch vụ phổ biến
  async getTopDichVu(top = 5): Promise<DichVuPhoBienDto[]> {
    return await apiService.get<DichVuPhoBienDto[]>(
      `/thong-ke/top-dich-vu?top=${top}`
    );
  }

  // Top sản phẩm bán chạy
  async getTopSanPham(top = 5): Promise<SanPhamPhoBienDto[]> {
    return await apiService.get<SanPhamPhoBienDto[]>(
      `/thong-ke/top-san-pham?top=${top}`
    );
  }

  // Hóa đơn gần đây
  async getHoaDonGanDay(soLuong = 10): Promise<HoaDonGanDayDto[]> {
    return await apiService.get<HoaDonGanDayDto[]>(
      `/thong-ke/hoa-donGanDay?soLuong=${soLuong}`
    );
  }

  // Top khách hàng
  async getTopKhachHang(top = 10): Promise<KhachHangTopDto[]> {
    return await apiService.get<KhachHangTopDto[]>(
      `/thong-ke/top-khach-hang?top=${top}`
    );
  }
}

export const statisticsService = new StatisticsService();
