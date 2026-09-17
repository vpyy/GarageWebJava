import React, { useState, useEffect } from 'react';
import { DashboardDto } from '../../types/statistics';
import { statisticsService } from '../../services/statisticsService';
import toast from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await statisticsService.getDashboard();
      setDashboardData(data);
    } catch (error: any) {
      console.error('Error loading dashboard:', error);

      // Hiển thị lỗi chi tiết hơn
      if (error.response?.status === 404) {
        toast.error('API thống kê không tìm thấy');
      } else if (error.response?.status === 500) {
        toast.error('Lỗi server khi tải dữ liệu thống kê');
      } else if (
        error.code === 'NETWORK_ERROR' ||
        error.message?.includes('Network Error')
      ) {
        toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối.');
      } else {
        toast.error(
          'Lỗi khi tải dữ liệu thống kê: ' + (error.message || 'Unknown error')
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Hoàn thành': { bg: '#dcfce7', color: '#166534', text: 'Hoàn thành' },
      'Đang xử lý': { bg: '#fef3c7', color: '#92400e', text: 'Đang xử lý' },
      'Chờ thanh toán': {
        bg: '#fee2e2',
        color: '#991b1b',
        text: 'Chờ thanh toán',
      },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig['Đang xử lý'];

    return (
      <span
        style={{
          background: config.bg,
          color: config.color,
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 500,
        }}
      >
        {config.text}
      </span>
    );
  };

  const thangHienTai = new Date().getMonth() + 1;
  const namHienTai = new Date().getFullYear();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 mb-4">
          <i className="fas fa-exclamation-triangle text-4xl"></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Không thể tải dữ liệu
        </h3>
        <button
          onClick={loadDashboardData}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Row 1: Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Revenue */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">
                Doanh thu tháng
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(dashboardData.doanhThuThangNay)}
              </p>
              <p className="text-blue-100 text-sm mt-1">
                <i className="fas fa-file-invoice mr-1"></i>
                {dashboardData.soHoaDonThangNay} hóa đơn
              </p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <i className="fas fa-dollar-sign text-2xl"></i>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">
                Tổng khách hàng
              </p>
              <p className="text-2xl font-bold">
                {dashboardData.tongKhachHang.toLocaleString()}
              </p>
              <p className="text-green-100 text-sm mt-1">
                <i className="fas fa-arrow-up mr-1"></i>
                Hoạt động
              </p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <i className="fas fa-users text-2xl"></i>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Tổng sản phẩm
              </p>
              <p className="text-2xl font-bold">{dashboardData.tongSanPham}</p>
              <p className="text-purple-100 text-sm mt-1">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                {dashboardData.sanPhamSapHet} sắp hết
              </p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <i className="fas fa-box text-2xl"></i>
            </div>
          </div>
        </div>

        {/* Total Services */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">
                Tổng dịch vụ
              </p>
              <p className="text-2xl font-bold">{dashboardData.tongDichVu}</p>
              <p className="text-orange-100 text-sm mt-1">
                <i className="fas fa-tools mr-1"></i>
                Đang cung cấp
              </p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <i className="fas fa-wrench text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Charts and Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Doanh thu theo tháng
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Tháng {thangHienTai}/{namHienTai}:{' '}
                <span className="font-semibold text-blue-600">
                  {formatCurrency(dashboardData.doanhThuThangNay)}
                </span>
                <span className="ml-2 text-gray-400">
                  ({dashboardData.soHoaDonThangNay} hóa đơn)
                </span>
              </p>
            </div>
            <span className="text-sm text-gray-500">Năm {namHienTai}</span>
          </div>

          {/* Build full 12-month array, fill missing months with 0 */}
          {(() => {
            const fullYear = Array.from({ length: 12 }, (_, i) => {
              const thang = i + 1;
              const found = dashboardData.doanhThuTheoThang?.find(
                x => x.thang === thang
              );
              return { thang, doanhThu: found?.doanhThu ?? 0 };
            });
            const maxDoanhThu = Math.max(...fullYear.map(x => x.doanhThu), 1);

            return (
              <div
                className="flex items-end justify-between gap-1 mt-4"
                style={{ height: '200px' }}
              >
                {fullYear.map((item, index) => {
                  const height = (item.doanhThu / maxDoanhThu) * 100;
                  const isCurrentMonth = item.thang === thangHienTai;
                  const hasData = item.doanhThu > 0;

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1"
                      style={{ height: '100%', justifyContent: 'flex-end' }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: `${Math.max(height, hasData ? 4 : 2)}%`,
                          minHeight: hasData ? '6px' : '2px',
                          borderRadius: '4px 4px 0 0',
                          background: isCurrentMonth
                            ? 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)'
                            : hasData
                              ? '#bfdbfe'
                              : '#f1f5f9',
                          transition: 'all 0.3s',
                          cursor: hasData ? 'pointer' : 'default',
                          boxShadow: isCurrentMonth
                            ? '0 -2px 8px rgba(59,130,246,0.4)'
                            : 'none',
                        }}
                        title={
                          hasData
                            ? `Tháng ${item.thang}: ${formatCurrency(item.doanhThu)}`
                            : `Tháng ${item.thang}: Chưa có dữ liệu`
                        }
                      />
                      <span
                        className="text-xs mt-1"
                        style={{
                          color: isCurrentMonth ? '#2563eb' : '#9ca3af',
                          fontWeight: isCurrentMonth ? 700 : 400,
                          fontSize: '11px',
                        }}
                      >
                        T{item.thang}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)',
                }}
              />
              <span className="text-xs text-gray-500">Tháng hiện tại</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: '#bfdbfe',
                }}
              />
              <span className="text-xs text-gray-500">Có doanh thu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: '#f1f5f9',
                }}
              />
              <span className="text-xs text-gray-500">Chưa có dữ liệu</span>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Sản phẩm bán chạy
          </h3>
          <div className="space-y-3">
            {dashboardData.topSanPham && dashboardData.topSanPham.length > 0 ? (
              dashboardData.topSanPham.slice(0, 5).map((product, index) => (
                <div
                  key={product.maSP}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        index === 0
                          ? 'bg-yellow-500'
                          : index === 1
                            ? 'bg-gray-400'
                            : index === 2
                              ? 'bg-orange-500'
                              : 'bg-blue-500'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {product.tenSP}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.soLuong} đã bán
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(product.doanhThu)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <i className="fas fa-box text-3xl mb-2"></i>
                <p className="text-sm">Chưa có dữ liệu sản phẩm</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Orders and Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Hóa đơn gần đây
            </h3>
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              Xem tất cả →
            </button>
          </div>

          {dashboardData.hoaDonGanDay &&
          dashboardData.hoaDonGanDay.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                      Mã HĐ
                    </th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                      Khách hàng
                    </th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                      Biển số
                    </th>
                    <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">
                      Tổng tiền
                    </th>
                    <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.hoaDonGanDay.slice(0, 6).map(invoice => (
                    <tr key={invoice.maHD} className="border-b border-gray-50">
                      <td className="py-3 text-sm font-medium text-blue-600">
                        #{invoice.maHD}
                      </td>
                      <td className="py-3 text-sm text-gray-800">
                        {invoice.tenKH}
                      </td>
                      <td className="py-3 text-sm text-gray-600 font-mono">
                        {invoice.bienSo}
                      </td>
                      <td className="py-3 text-sm font-semibold text-gray-800 text-right">
                        {formatCurrency(invoice.tongTien)}
                      </td>
                      <td className="py-3 text-center">
                        {getStatusBadge(invoice.trangThai || 'Đang xử lý')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <i className="fas fa-file-invoice text-3xl mb-2"></i>
              <p className="text-sm">Chưa có hóa đơn nào</p>
            </div>
          )}
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Dịch vụ phổ biến
          </h3>
          <div className="space-y-4">
            {dashboardData.topDichVu && dashboardData.topDichVu.length > 0 ? (
              dashboardData.topDichVu.slice(0, 5).map((service, index) => (
                <div
                  key={service.maDV}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                        index === 0
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                          : index === 1
                            ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                            : index === 2
                              ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                              : 'bg-gradient-to-r from-blue-400 to-blue-500'
                      }`}
                    >
                      <i className="fas fa-wrench"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {service.tenDV}
                      </p>
                      <p className="text-sm text-gray-500">
                        {service.soLanSuDung} lần sử dụng
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatCurrency(service.doanhThu)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {service.soLuong} dịch vụ
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <i className="fas fa-wrench text-3xl mb-2"></i>
                <p className="text-sm">Chưa có dữ liệu dịch vụ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
