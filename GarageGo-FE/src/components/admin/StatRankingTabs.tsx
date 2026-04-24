import React from 'react';
import {
  DichVuPhoBienDto,
  SanPhamPhoBienDto,
  KhachHangTopDto,
} from '../../types/statistics';
import { RankBadge, StatEmptyState } from './StatShared';

interface ProductsTabProps {
  topSanPham: SanPhamPhoBienDto[];
  formatCurrency: (amount: number) => string;
  onReload: () => void;
}

export const StatProductsTab: React.FC<ProductsTabProps> = ({
  topSanPham,
  formatCurrency,
  onReload,
}) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border">
    <h4 className="text-lg font-semibold mb-4">Top sản phẩm bán chạy</h4>
    {topSanPham.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 text-sm font-medium text-gray-500">
                Hạng
              </th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">
                Tên sản phẩm
              </th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">
                Số lượng bán
              </th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">
                Doanh thu
              </th>
            </tr>
          </thead>
          <tbody>
            {topSanPham.map((product, index) => (
              <tr key={product.maSP} className="border-b border-gray-50">
                <td className="py-3">
                  <RankBadge index={index} />
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
      <StatEmptyState
        icon="fas fa-box"
        title="Chưa có dữ liệu sản phẩm"
        description="Hệ thống chưa có dữ liệu bán hàng để thống kê"
        onReload={onReload}
      />
    )}
  </div>
);

interface ServicesTabProps {
  topDichVu: DichVuPhoBienDto[];
  formatCurrency: (amount: number) => string;
  onReload: () => void;
}

export const StatServicesTab: React.FC<ServicesTabProps> = ({
  topDichVu,
  formatCurrency,
  onReload,
}) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border">
    <h4 className="text-lg font-semibold mb-4">Top dịch vụ phổ biến</h4>
    {topDichVu.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 text-sm font-medium text-gray-500">
                Hạng
              </th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">
                Tên dịch vụ
              </th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">
                Số lần sử dụng
              </th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">
                Doanh thu
              </th>
            </tr>
          </thead>
          <tbody>
            {topDichVu.map((service, index) => (
              <tr key={service.maDV} className="border-b border-gray-50">
                <td className="py-3">
                  <RankBadge index={index} />
                </td>
                <td className="py-3 text-sm font-medium">{service.tenDV}</td>
                <td className="py-3 text-sm text-right">
                  {service.soLanSuDung}
                </td>
                <td className="py-3 text-sm text-right font-semibold text-green-600">
                  {formatCurrency(service.doanhThu)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <StatEmptyState
        icon="fas fa-wrench"
        title="Chưa có dữ liệu dịch vụ"
        description="Hệ thống chưa có dữ liệu sử dụng dịch vụ để thống kê"
        onReload={onReload}
      />
    )}
  </div>
);

interface CustomersTabProps {
  topKhachHang: KhachHangTopDto[];
  formatCurrency: (amount: number) => string;
  onReload: () => void;
}

export const StatCustomersTab: React.FC<CustomersTabProps> = ({
  topKhachHang,
  formatCurrency,
  onReload,
}) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border">
    <h4 className="text-lg font-semibold mb-4">Top khách hàng VIP</h4>
    {topKhachHang.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 text-sm font-medium text-gray-500">
                Hạng
              </th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">
                Tên khách hàng
              </th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">
                Số điện thoại
              </th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">
                Số hóa đơn
              </th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">
                Tổng chi tiêu
              </th>
            </tr>
          </thead>
          <tbody>
            {topKhachHang.map((customer, index) => (
              <tr key={customer.maKH} className="border-b border-gray-50">
                <td className="py-3">
                  <RankBadge index={index} />
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
      <StatEmptyState
        icon="fas fa-users"
        title="Chưa có dữ liệu khách hàng"
        description="Hệ thống chưa có dữ liệu khách hàng để thống kê"
        onReload={onReload}
      />
    )}
  </div>
);
