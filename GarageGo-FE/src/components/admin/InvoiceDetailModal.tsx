import React from 'react';
import { Invoice } from '../../types/invoice';

interface Props {
  invoice: Invoice;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  onComplete: (id: number) => void;
  onClose: () => void;
}

export const InvoiceDetailModal: React.FC<Props> = ({
  invoice,
  formatCurrency,
  formatDate,
  getStatusColor,
  onComplete,
  onClose,
}) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
      <div className="mt-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Chi tiết hóa đơn #{invoice.maHD}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Customer + Vehicle Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Thông tin khách hàng
            </h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Tên:</span>{' '}
                {invoice.khachHang?.tenKH}
              </p>
              <p>
                <span className="font-medium">SĐT:</span>{' '}
                {invoice.khachHang?.sdt}
              </p>
              <p>
                <span className="font-medium">Email:</span>{' '}
                {invoice.khachHang?.email}
              </p>
              <p>
                <span className="font-medium">Địa chỉ:</span>{' '}
                {invoice.khachHang?.diaChi}
              </p>
            </div>
          </div>
          {invoice.xe && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Thông tin xe</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Biển số:</span>{' '}
                  {invoice.xe.bienSo}
                </p>
                <p>
                  <span className="font-medium">Hãng xe:</span>{' '}
                  {invoice.xe.hangXe}
                </p>
                <p>
                  <span className="font-medium">Đời xe:</span>{' '}
                  {invoice.xe.doiXe}
                </p>
                <p>
                  <span className="font-medium">Màu xe:</span>{' '}
                  {invoice.xe.mauXe}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Invoice Info */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Thông tin hóa đơn</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <p>
              <span className="font-medium">Ngày lập:</span>{' '}
              {formatDate(invoice.ngayLap)}
            </p>
            <p>
              <span className="font-medium">Hình thức TT:</span>{' '}
              {invoice.hinhThucTT}
            </p>
            <p>
              <span className="font-medium">Nhân viên:</span>{' '}
              {invoice.username || 'Hệ thống'}
            </p>
          </div>
        </div>

        {/* Dịch vụ table */}
        {invoice.chiTietDichVus && invoice.chiTietDichVus.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Dịch vụ</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      'Dịch vụ',
                      'Hình ảnh',
                      'Số lượng',
                      'Đơn giá',
                      'Thành tiền',
                    ].map(col => (
                      <th
                        key={col}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.chiTietDichVus.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm">
                        <div className="font-medium">
                          {item.dichVu?.tenDichVu}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {item.dichVu?.moTa}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {item.dichVu?.hinhAnh && (
                          <img
                            src={item.dichVu.hinhAnh}
                            alt={item.dichVu.tenDichVu}
                            className="w-12 h-12 object-cover rounded cursor-pointer"
                            onClick={() =>
                              window.open(item.dichVu?.hinhAnh, '_blank')
                            }
                          />
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm">{item.soLuong}</td>
                      <td className="px-4 py-2 text-sm">
                        {formatCurrency(item.donGia)}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium">
                        {formatCurrency(item.thanhTien)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sản phẩm table */}
        {invoice.chiTietSanPhams && invoice.chiTietSanPhams.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Sản phẩm</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      'Sản phẩm',
                      'Hình ảnh',
                      'Số lượng',
                      'Đơn giá',
                      'Thành tiền',
                    ].map(col => (
                      <th
                        key={col}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.chiTietSanPhams.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm">
                        <div className="font-medium">
                          {item.sanPham?.tenSanPham}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {item.sanPham?.moTa}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {item.sanPham?.hinhAnh && (
                          <img
                            src={item.sanPham.hinhAnh}
                            alt={item.sanPham.tenSanPham}
                            className="w-12 h-12 object-cover rounded cursor-pointer"
                            onClick={() =>
                              window.open(item.sanPham?.hinhAnh, '_blank')
                            }
                          />
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm">{item.soLuong}</td>
                      <td className="px-4 py-2 text-sm">
                        {formatCurrency(item.donGia)}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium">
                        {formatCurrency(item.thanhTien)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(invoice.trangThai)}`}
            >
              {invoice.trangThai}
            </span>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                Tổng tiền: {formatCurrency(invoice.tongTien)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6 gap-3">
          {invoice.trangThai !== 'Hoàn thành' && (
            <button
              onClick={() => {
                onComplete(invoice.maHD);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Hoàn thành
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
);
