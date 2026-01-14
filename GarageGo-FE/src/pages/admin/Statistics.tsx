import React, { useState, useEffect } from 'react';
import { 
  TongQuanDto, 
  DoanhThuTheoThangDto, 
  DoanhThuTheoNgayResponse,
  DichVuPhoBienDto,
  SanPhamPhoBienDto,
  KhachHangTopDto
} from '../../types/statistics';
import { statisticsService } from '../../services/statisticsService';
import toast from 'react-hot-toast';

export const Statistics: React.FC = () => {
  const [tongQuan, setTongQuan] = useState<TongQuanDto | null>(null);
  const [doanhThuTheoThang, setDoanhThuTheoThang] = useState<DoanhThuTheoThangDto[]>([]);
  const [doanhThuTheoNgay, setDoanhThuTheoNgay] = useState<DoanhThuTheoNgayResponse | null>(null);
  const [topDichVu, setTopDichVu] = useState<DichVuPhoBienDto[]>([]);
  const [topSanPham, setTopSanPham] = useState<SanPhamPhoBienDto[]>([]);
  const [topKhachHang, setTopKhachHang] = useState<KhachHangTopDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [
        tongQuanData,
        doanhThuThangData,
        doanhThuNgayData,
        dichVuData,
        sanPhamData,
        khachHangData
      ] = await Promise.all([
        statisticsService.getTongQuan(),
        statisticsService.getDoanhThuTheoThang(),
        statisticsService.getDoanhThuTheoNgay(dateRange.from, dateRange.to),
        statisticsService.getTopDichVu(10),
        statisticsService.getTopSanPham(10),
        statisticsService.getTopKhachHang(10)
      ]);

      setTongQuan(tongQuanData);
      setDoanhThuTheoThang(doanhThuThangData || []);
      setDoanhThuTheoNgay(doanhThuNgayData);
      setTopDichVu(dichVuData || []);
      setTopSanPham(sanPhamData || []);
      setTopKhachHang(khachHangData || []);
    } catch (error: any) {
      console.error('Error loading statistics:', error);
      
      // Hiển thị lỗi chi tiết hơn
      if (error.response?.status === 404) {
        toast.error('API thống kê không tìm thấy');
      } else if (error.response?.status === 500) {
        toast.error('Lỗi server khi tải dữ liệu thống kê');
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối.');
      } else {
        toast.error('Lỗi khi tải dữ liệu thống kê: ' + (error.message || 'Unknown error'));
      }
      
      // Set empty data để tránh lỗi render
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
      const data = await statisticsService.getDoanhThuTheoNgay(dateRange.from, dateRange.to);
      setDoanhThuTheoNgay(data);
      toast.success('Đã cập nhật dữ liệu theo khoảng thời gian mới');
    } catch (error: any) {
      console.error('Error loading daily revenue:', error);
      
      if (error.response?.status === 404) {
        toast.error('API doanh thu theo ngày không tìm thấy');
      } else if (error.response?.status === 500) {
        toast.error('Lỗi server khi tải dữ liệu doanh thu theo ngày');
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        toast.error('Không thể kết nối đến server');
      } else {
        toast.error('Lỗi khi tải dữ liệu theo ngày: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
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

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Tổng quan', icon: 'fas fa-chart-pie' },
            { id: 'revenue', name: 'Doanh thu', icon: 'fas fa-dollar-sign' },
            { id: 'products', name: 'Sản phẩm', icon: 'fas fa-box' },
            { id: 'services', name: 'Dịch vụ', icon: 'fas fa-wrench' },
            { id: 'customers', name: 'Khách hàng', icon: 'fas fa-users' }
          ].map((tab) => (
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {tongQuan ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <i className="fas fa-users text-blue-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Tổng khách hàng</p>
                    <p className="text-2xl font-semibold text-gray-900">{tongQuan.tongKhachHang}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <i className="fas fa-car text-green-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Tổng xe</p>
                    <p className="text-2xl font-semibold text-gray-900">{tongQuan.tongXe}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <i className="fas fa-file-invoice text-purple-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Tổng hóa đơn</p>
                    <p className="text-2xl font-semibold text-gray-900">{tongQuan.tongHoaDon}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <i className="fas fa-dollar-sign text-yellow-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Doanh thu năm</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(tongQuan.doanhThuNam)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <i className="fas fa-calendar-day text-indigo-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Doanh thu hôm nay</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(tongQuan.doanhThuHomNay)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <i className="fas fa-exclamation-triangle text-red-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Sản phẩm sắp hết</p>
                    <p className="text-2xl font-semibold text-gray-900">{tongQuan.sanPhamSapHet}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <i className="fas fa-clock text-orange-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Yêu cầu đang xử lý</p>
                    <p className="text-2xl font-semibold text-gray-900">{tongQuan.yeuCauDangXuLy}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <i className="fas fa-calendar-alt text-teal-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Hóa đơn tháng này</p>
                    <p className="text-2xl font-semibold text-gray-900">{tongQuan.soHoaDonThangNay}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-chart-pie text-6xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Không thể tải dữ liệu tổng quan</h3>
              <p className="text-gray-500 mb-4">Vui lòng kiểm tra kết nối và thử lại</p>
              <button
                onClick={loadAllData}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
              >
                <i className="fas fa-sync-alt"></i>
                Thử lại
              </button>
            </div>
          )}
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          {/* Date Range Selector */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h4 className="text-lg font-semibold mb-4">Chọn khoảng thời gian</h4>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <button
                onClick={handleDateRangeChange}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-6"
              >
                Cập nhật
              </button>
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h4 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h4>
            {doanhThuTheoThang.length > 0 ? (
              <div className="flex items-end justify-between h-64 gap-2">
                {doanhThuTheoThang.map((item, index) => {
                  const maxDoanhThu = Math.max(...doanhThuTheoThang.map(x => x.doanhThu));
                  const height = maxDoanhThu > 0 ? (item.doanhThu / maxDoanhThu) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="text-xs text-gray-600 mb-2 transform -rotate-90 origin-center">
                        {formatCurrency(item.doanhThu)}
                      </div>
                      <div
                        className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-colors cursor-pointer"
                        style={{ height: `${height}%`, minHeight: '8px' }}
                        title={`Tháng ${item.thang}: ${formatCurrency(item.doanhThu)} (${item.soHoaDon} hóa đơn)`}
                      ></div>
                      <span className="text-xs text-gray-500 mt-2">T{item.thang}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <i className="fas fa-chart-bar text-4xl mb-4"></i>
                  <p>Chưa có dữ liệu doanh thu theo tháng</p>
                </div>
              </div>
            )}
          </div>

          {/* Daily Revenue */}
          {doanhThuTheoNgay ? (
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h4 className="text-lg font-semibold mb-4">
                Doanh thu theo ngày ({formatDate(dateRange.from)} - {formatDate(dateRange.to)})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(doanhThuTheoNgay.tongDoanhThu)}</p>
                  <p className="text-sm text-gray-500">Tổng doanh thu</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{doanhThuTheoNgay.tongHoaDon}</p>
                  <p className="text-sm text-gray-500">Tổng hóa đơn</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {doanhThuTheoNgay.tongHoaDon > 0 ? formatCurrency(doanhThuTheoNgay.tongDoanhThu / doanhThuTheoNgay.tongHoaDon) : '0 ₫'}
                  </p>
                  <p className="text-sm text-gray-500">Trung bình/hóa đơn</p>
                </div>
              </div>
              
              {doanhThuTheoNgay.chiTiet && doanhThuTheoNgay.chiTiet.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-sm font-medium text-gray-500">Ngày</th>
                        <th className="text-right py-2 text-sm font-medium text-gray-500">Doanh thu</th>
                        <th className="text-right py-2 text-sm font-medium text-gray-500">Số hóa đơn</th>
                        <th className="text-right py-2 text-sm font-medium text-gray-500">Trung bình</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doanhThuTheoNgay.chiTiet.map((item, index) => (
                        <tr key={index} className="border-b border-gray-50">
                          <td className="py-2 text-sm">{formatDate(item.ngay)}</td>
                          <td className="py-2 text-sm text-right font-semibold">{formatCurrency(item.tongTien)}</td>
                          <td className="py-2 text-sm text-right">{item.soHoaDon}</td>
                          <td className="py-2 text-sm text-right">
                            {item.soHoaDon > 0 ? formatCurrency(item.tongTien / item.soHoaDon) : '0 ₫'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-calendar-times text-3xl mb-2"></i>
                  <p className="text-sm">Không có dữ liệu trong khoảng thời gian này</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h4 className="text-lg font-semibold mb-4">Doanh thu theo ngày</h4>
              <div className="text-center py-20">
                <div className="text-gray-400 mb-4">
                  <i className="fas fa-calendar-times text-6xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Không thể tải dữ liệu</h3>
                <p className="text-gray-500 mb-4">Vui lòng chọn khoảng thời gian và thử lại</p>
                <button
                  onClick={handleDateRangeChange}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                >
                  <i className="fas fa-sync-alt"></i>
                  Thử lại
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h4 className="text-lg font-semibold mb-4">Top sản phẩm bán chạy</h4>
          {topSanPham.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Hạng</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Tên sản phẩm</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500">Số lượng bán</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500">Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {topSanPham.map((product, index) => (
                    <tr key={product.maSP} className="border-b border-gray-50">
                      <td className="py-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 text-sm font-medium">{product.tenSP}</td>
                      <td className="py-3 text-sm text-right">{product.soLuong}</td>
                      <td className="py-3 text-sm text-right font-semibold text-green-600">
                        {formatCurrency(product.doanhThu)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-box text-6xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có dữ liệu sản phẩm</h3>
              <p className="text-gray-500 mb-4">Hệ thống chưa có dữ liệu bán hàng để thống kê</p>
              <button
                onClick={loadAllData}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
              >
                <i className="fas fa-sync-alt"></i>
                Tải lại dữ liệu
              </button>
            </div>
          )}
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h4 className="text-lg font-semibold mb-4">Top dịch vụ phổ biến</h4>
          {topDichVu.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Hạng</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Tên dịch vụ</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500">Số lần sử dụng</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500">Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {topDichVu.map((service, index) => (
                    <tr key={service.maDV} className="border-b border-gray-50">
                      <td className="py-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 text-sm font-medium">{service.tenDV}</td>
                      <td className="py-3 text-sm text-right">{service.soLanSuDung}</td>
                      <td className="py-3 text-sm text-right font-semibold text-green-600">
                        {formatCurrency(service.doanhThu)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-wrench text-6xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có dữ liệu dịch vụ</h3>
              <p className="text-gray-500 mb-4">Hệ thống chưa có dữ liệu sử dụng dịch vụ để thống kê</p>
              <button
                onClick={loadAllData}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
              >
                <i className="fas fa-sync-alt"></i>
                Tải lại dữ liệu
              </button>
            </div>
          )}
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h4 className="text-lg font-semibold mb-4">Top khách hàng VIP</h4>
          {topKhachHang.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Hạng</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Tên khách hàng</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Số điện thoại</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500">Số hóa đơn</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500">Tổng chi tiêu</th>
                  </tr>
                </thead>
                <tbody>
                  {topKhachHang.map((customer, index) => (
                    <tr key={customer.maKH} className="border-b border-gray-50">
                      <td className="py-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 text-sm font-medium">{customer.tenKH}</td>
                      <td className="py-3 text-sm">{customer.sdt || 'N/A'}</td>
                      <td className="py-3 text-sm text-right">{customer.soHoaDon}</td>
                      <td className="py-3 text-sm text-right font-semibold text-green-600">
                        {formatCurrency(customer.tongChiTieu)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-users text-6xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có dữ liệu khách hàng</h3>
              <p className="text-gray-500 mb-4">Hệ thống chưa có dữ liệu khách hàng để thống kê</p>
              <button
                onClick={loadAllData}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
              >
                <i className="fas fa-sync-alt"></i>
                Tải lại dữ liệu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};