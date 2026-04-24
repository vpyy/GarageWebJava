import React from 'react';
import {
  DoanhThuTheoThangDto,
  DoanhThuTheoNgayResponse,
} from '../../types/statistics';

interface Props {
  doanhThuTheoThang: DoanhThuTheoThangDto[];
  doanhThuTheoNgay: DoanhThuTheoNgayResponse | null;
  dateRange: { from: string; to: string };
  onDateChange: (field: 'from' | 'to', value: string) => void;
  onUpdate: () => void;
  onRetry: () => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

export const StatRevenueTab: React.FC<Props> = ({
  doanhThuTheoThang,
  doanhThuTheoNgay,
  dateRange,
  onDateChange,
  onUpdate,
  onRetry,
  formatCurrency,
  formatDate,
}) => (
  <div className="space-y-6">
    {/* Date Range Selector */}
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h4 className="text-lg font-semibold mb-4">Chọn khoảng thời gian</h4>
      <div className="flex items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Từ ngày
          </label>
          <input
            type="date"
            value={dateRange.from}
            onChange={e => onDateChange('from', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Đến ngày
          </label>
          <input
            type="date"
            value={dateRange.to}
            onChange={e => onDateChange('to', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <button
          onClick={onUpdate}
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
            const maxDoanhThu = Math.max(
              ...doanhThuTheoThang.map(x => x.doanhThu)
            );
            const height =
              maxDoanhThu > 0 ? (item.doanhThu / maxDoanhThu) * 100 : 0;
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
                <span className="text-xs text-gray-500 mt-2">
                  T{item.thang}
                </span>
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
          Doanh thu theo ngày ({formatDate(dateRange.from)} -{' '}
          {formatDate(dateRange.to)})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(doanhThuTheoNgay.tongDoanhThu)}
            </p>
            <p className="text-sm text-gray-500">Tổng doanh thu</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {doanhThuTheoNgay.tongHoaDon}
            </p>
            <p className="text-sm text-gray-500">Tổng hóa đơn</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {doanhThuTheoNgay.tongHoaDon > 0
                ? formatCurrency(
                    doanhThuTheoNgay.tongDoanhThu / doanhThuTheoNgay.tongHoaDon
                  )
                : '0 ₫'}
            </p>
            <p className="text-sm text-gray-500">Trung bình/hóa đơn</p>
          </div>
        </div>
        {doanhThuTheoNgay.chiTiet && doanhThuTheoNgay.chiTiet.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-medium text-gray-500">
                    Ngày
                  </th>
                  <th className="text-right py-2 text-sm font-medium text-gray-500">
                    Doanh thu
                  </th>
                  <th className="text-right py-2 text-sm font-medium text-gray-500">
                    Số hóa đơn
                  </th>
                  <th className="text-right py-2 text-sm font-medium text-gray-500">
                    Trung bình
                  </th>
                </tr>
              </thead>
              <tbody>
                {doanhThuTheoNgay.chiTiet.map((item, index) => (
                  <tr key={index} className="border-b border-gray-50">
                    <td className="py-2 text-sm">{formatDate(item.ngay)}</td>
                    <td className="py-2 text-sm text-right font-semibold">
                      {formatCurrency(item.tongTien)}
                    </td>
                    <td className="py-2 text-sm text-right">{item.soHoaDon}</td>
                    <td className="py-2 text-sm text-right">
                      {item.soHoaDon > 0
                        ? formatCurrency(item.tongTien / item.soHoaDon)
                        : '0 ₫'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-calendar-times text-3xl mb-2"></i>
            <p className="text-sm">
              Không có dữ liệu trong khoảng thời gian này
            </p>
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
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Không thể tải dữ liệu
          </h3>
          <p className="text-gray-500 mb-4">
            Vui lòng chọn khoảng thời gian và thử lại
          </p>
          <button
            onClick={onRetry}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <i className="fas fa-sync-alt"></i>
            Thử lại
          </button>
        </div>
      </div>
    )}
  </div>
);
