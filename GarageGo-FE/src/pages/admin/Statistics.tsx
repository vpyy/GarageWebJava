import React, { useState, useEffect } from 'react';
import {
  TongQuanDto,
  DoanhThuTheoThangDto,
  DoanhThuTheoNgayResponse,
  DichVuPhoBienDto,
  SanPhamPhoBienDto,
  KhachHangTopDto,
} from '../../types/statistics';
import { statisticsService } from '../../services/statisticsService';
import { StatOverviewCards } from '../../components/admin/StatOverviewCards';
import { StatRevenueTab } from '../../components/admin/StatRevenueTab';
import {
  StatProductsTab,
  StatServicesTab,
  StatCustomersTab,
} from '../../components/admin/StatRankingTabs';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'overview', name: 'Tổng quan', icon: 'fas fa-chart-pie' },
  { id: 'revenue', name: 'Doanh thu', icon: 'fas fa-dollar-sign' },
  { id: 'products', name: 'Sản phẩm', icon: 'fas fa-box' },
  { id: 'services', name: 'Dịch vụ', icon: 'fas fa-wrench' },
  { id: 'customers', name: 'Khách hàng', icon: 'fas fa-users' },
];

export const Statistics: React.FC = () => {
  const [tongQuan, setTongQuan] = useState<TongQuanDto | null>(null);
  const [doanhThuTheoThang, setDoanhThuTheoThang] = useState<
    DoanhThuTheoThangDto[]
  >([]);
  const [doanhThuTheoNgay, setDoanhThuTheoNgay] =
    useState<DoanhThuTheoNgayResponse | null>(null);
  const [topDichVu, setTopDichVu] = useState<DichVuPhoBienDto[]>([]);
  const [topSanPham, setTopSanPham] = useState<SanPhamPhoBienDto[]>([]);
  const [topKhachHang, setTopKhachHang] = useState<KhachHangTopDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const handleError = (error: any, context: string) => {
    if (error.response?.status === 404)
      toast.error(`API ${context} không tìm thấy`);
    else if (error.response?.status === 500)
      toast.error(`Lỗi server khi tải ${context}`);
    else if (
      error.code === 'NETWORK_ERROR' ||
      error.message?.includes('Network Error')
    )
      toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối.');
    else
      toast.error(
        `Lỗi khi tải ${context}: ${error.message || 'Unknown error'}`
      );
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [
        tongQuanData,
        doanhThuThangData,
        doanhThuNgayData,
        dichVuData,
        sanPhamData,
        khachHangData,
      ] = await Promise.all([
        statisticsService.getTongQuan(),
        statisticsService.getDoanhThuTheoThang(),
        statisticsService.getDoanhThuTheoNgay(dateRange.from, dateRange.to),
        statisticsService.getTopDichVu(10),
        statisticsService.getTopSanPham(10),
        statisticsService.getTopKhachHang(10),
      ]);
      setTongQuan(tongQuanData);
      setDoanhThuTheoThang(doanhThuThangData || []);
      setDoanhThuTheoNgay(doanhThuNgayData);
      setTopDichVu(dichVuData || []);
      setTopSanPham(sanPhamData || []);
      setTopKhachHang(khachHangData || []);
    } catch (error: any) {
      console.error('Error loading statistics:', error);
      handleError(error, 'dữ liệu thống kê');
      setTongQuan(null);
      setDoanhThuTheoThang([]);
      setDoanhThuTheoNgay(null);
      setTopDichVu([]);
      setTopSanPham([]);
      setTopKhachHang([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = async () => {
    try {
      const data = await statisticsService.getDoanhThuTheoNgay(
        dateRange.from,
        dateRange.to
      );
      setDoanhThuTheoNgay(data);
      toast.success('Đã cập nhật dữ liệu theo khoảng thời gian mới');
    } catch (error: any) {
      console.error('Error loading daily revenue:', error);
      handleError(error, 'doanh thu theo ngày');
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('vi-VN');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Thống kê chi tiết</h3>
        <button
          onClick={loadAllData}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <i className="fas fa-sync-alt"></i>
          Làm mới
        </button>
      </div>

      {/* Tab Nav */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className={tab.icon}></i>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' &&
        (tongQuan ? (
          <StatOverviewCards
            tongQuan={tongQuan}
            formatCurrency={formatCurrency}
          />
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-chart-pie text-6xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Không thể tải dữ liệu tổng quan
            </h3>
            <p className="text-gray-500 mb-4">
              Vui lòng kiểm tra kết nối và thử lại
            </p>
            <button
              onClick={loadAllData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
            >
              <i className="fas fa-sync-alt"></i>
              Thử lại
            </button>
          </div>
        ))}

      {activeTab === 'revenue' && (
        <StatRevenueTab
          doanhThuTheoThang={doanhThuTheoThang}
          doanhThuTheoNgay={doanhThuTheoNgay}
          dateRange={dateRange}
          onDateChange={(field, value) =>
            setDateRange(prev => ({ ...prev, [field]: value }))
          }
          onUpdate={handleDateRangeChange}
          onRetry={handleDateRangeChange}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}

      {activeTab === 'products' && (
        <StatProductsTab
          topSanPham={topSanPham}
          formatCurrency={formatCurrency}
          onReload={loadAllData}
        />
      )}

      {activeTab === 'services' && (
        <StatServicesTab
          topDichVu={topDichVu}
          formatCurrency={formatCurrency}
          onReload={loadAllData}
        />
      )}

      {activeTab === 'customers' && (
        <StatCustomersTab
          topKhachHang={topKhachHang}
          formatCurrency={formatCurrency}
          onReload={loadAllData}
        />
      )}
    </div>
  );
};
