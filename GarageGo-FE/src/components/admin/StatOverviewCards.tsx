import React from 'react';
import { TongQuanDto } from '../../types/statistics';

interface Props {
  tongQuan: TongQuanDto;
  formatCurrency: (amount: number) => string;
}

const statCards = (
  tongQuan: TongQuanDto,
  formatCurrency: (n: number) => string
) => [
  {
    icon: 'fas fa-users',
    color: 'blue',
    label: 'Tổng khách hàng',
    value: tongQuan.tongKhachHang,
  },
  {
    icon: 'fas fa-car',
    color: 'green',
    label: 'Tổng xe',
    value: tongQuan.tongXe,
  },
  {
    icon: 'fas fa-file-invoice',
    color: 'purple',
    label: 'Tổng hóa đơn',
    value: tongQuan.tongHoaDon,
  },
  {
    icon: 'fas fa-dollar-sign',
    color: 'yellow',
    label: 'Doanh thu năm',
    value: formatCurrency(tongQuan.doanhThuNam),
  },
  {
    icon: 'fas fa-calendar-day',
    color: 'indigo',
    label: 'Doanh thu hôm nay',
    value: formatCurrency(tongQuan.doanhThuHomNay),
  },
  {
    icon: 'fas fa-exclamation-triangle',
    color: 'red',
    label: 'Sản phẩm sắp hết',
    value: tongQuan.sanPhamSapHet,
  },
  {
    icon: 'fas fa-clock',
    color: 'orange',
    label: 'Yêu cầu đang xử lý',
    value: tongQuan.yeuCauDangXuLy,
  },
  {
    icon: 'fas fa-calendar-alt',
    color: 'teal',
    label: 'Hóa đơn tháng này',
    value: tongQuan.soHoaDonThangNay,
  },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  red: 'bg-red-100 text-red-600',
  orange: 'bg-orange-100 text-orange-600',
  teal: 'bg-teal-100 text-teal-600',
};

export const StatOverviewCards: React.FC<Props> = ({
  tongQuan,
  formatCurrency,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {statCards(tongQuan, formatCurrency).map((card, idx) => (
      <div key={idx} className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${colorMap[card.color]}`}>
            <i className={card.icon}></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);
