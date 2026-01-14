import React, { useState, useEffect } from 'react';
import { Invoice } from '../../types/invoice';
import { invoiceService } from '../../services/invoiceService';
import toast from 'react-hot-toast';

export const InvoiceManagement: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getAll();
      setInvoices(data || []); // Đảm bảo luôn có array
    } catch (error: any) {
      console.error('Error loading invoices:', error);
      
      // Hiển thị lỗi chi tiết hơn
      if (error.response?.status === 404) {
        toast.error('API hóa đơn không tìm thấy');
      } else if (error.response?.status === 500) {
        toast.error('Lỗi server khi tải dữ liệu hóa đơn');
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối.');
      } else {
        toast.error('Lỗi khi tải dữ liệu hóa đơn: ' + (error.message || 'Unknown error'));
      }
      
      // Set empty array để tránh lỗi render
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn hoàn thành hóa đơn này?')) {
      try {
        await invoiceService.complete(id);
        toast.success('Hoàn thành hóa đơn thành công');
        loadInvoices();
      } catch (error: any) {
        toast.error(error.response?.data || 'Có lỗi xảy ra');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      try {
        await invoiceService.delete(id);
        toast.success('Xóa hóa đơn thành công');
        loadInvoices();
      } catch (error: any) {
        toast.error(error.response?.data || 'Có lỗi xảy ra');
      }
    }
  };

  const viewDetails = async (invoice: Invoice) => {
    try {
      const detailData = await invoiceService.getById(invoice.maHD);
      setSelectedInvoice(detailData);
      setShowModal(true);
    } catch (error) {
      toast.error('Lỗi khi tải chi tiết hóa đơn');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'chờ xác nhận':
        return 'bg-yellow-100 text-yellow-800';
      case 'đang xử lý':
        return 'bg-blue-100 text-blue-800';
      case 'hoàn thành':
        return 'bg-green-100 text-green-800';
      case 'hủy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <h3 className="text-2xl font-bold text-gray-800">Quản lý hóa đơn</h3>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {invoices.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã HĐ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Xe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày lập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.maHD}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{invoice.maHD}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {invoice.khachHang?.tenKH || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {invoice.khachHang?.sdt}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {invoice.xe ? (
                    <div>
                      <div className="text-sm text-gray-900">
                        {invoice.xe.bienSo}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.xe.hangXe} {invoice.xe.doiXe}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Đơn hàng sản phẩm</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(invoice.ngayLap)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(invoice.tongTien)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.trangThai)}`}>
                    {invoice.trangThai}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => viewDetails(invoice)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    title="Xem chi tiết"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  {invoice.trangThai !== 'Hoàn thành' && (
                    <button
                      onClick={() => handleComplete(invoice.maHD)}
                      className="text-green-600 hover:text-green-900 mr-3"
                      title="Hoàn thành"
                    >
                      <i className="fas fa-check"></i>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(invoice.maHD)}
                    className="text-red-600 hover:text-red-900"
                    title="Xóa"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-file-invoice text-6xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có hóa đơn nào</h3>
            <p className="text-gray-500 mb-4">Hệ thống chưa có dữ liệu hóa đơn để hiển thị</p>
            <button
              onClick={loadInvoices}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
            >
              <i className="fas fa-sync-alt"></i>
              Tải lại dữ liệu
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedInvoice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết hóa đơn #{selectedInvoice.maHD}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin khách hàng</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Tên:</span> {selectedInvoice.khachHang?.tenKH}</p>
                    <p><span className="font-medium">SĐT:</span> {selectedInvoice.khachHang?.sdt}</p>
                    <p><span className="font-medium">Email:</span> {selectedInvoice.khachHang?.email}</p>
                    <p><span className="font-medium">Địa chỉ:</span> {selectedInvoice.khachHang?.diaChi}</p>
                  </div>
                </div>
                
                {selectedInvoice.xe && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Thông tin xe</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Biển số:</span> {selectedInvoice.xe.bienSo}</p>
                      <p><span className="font-medium">Hãng xe:</span> {selectedInvoice.xe.hangXe}</p>
                      <p><span className="font-medium">Đời xe:</span> {selectedInvoice.xe.doiXe}</p>
                      <p><span className="font-medium">Màu xe:</span> {selectedInvoice.xe.mauXe}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Thông tin hóa đơn</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <p><span className="font-medium">Ngày lập:</span> {formatDate(selectedInvoice.ngayLap)}</p>
                  <p><span className="font-medium">Hình thức TT:</span> {selectedInvoice.hinhThucTT}</p>
                  <p><span className="font-medium">Nhân viên:</span> {selectedInvoice.username || 'Hệ thống'}</p>
                </div>
              </div>

              {/* Dịch vụ */}
              {selectedInvoice.chiTietDichVus && selectedInvoice.chiTietDichVus.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Dịch vụ</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dịch vụ</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedInvoice.chiTietDichVus.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm">
                              <div>
                                <div className="font-medium">{item.dichVu?.tenDichVu}</div>
                                <div className="text-gray-500 text-xs">{item.dichVu?.moTa}</div>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {item.dichVu?.hinhAnh && (
                                <img
                                  src={item.dichVu.hinhAnh}
                                  alt={item.dichVu.tenDichVu}
                                  className="w-12 h-12 object-cover rounded cursor-pointer"
                                  onClick={() => window.open(item.dichVu?.hinhAnh, '_blank')}
                                />
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm">{item.soLuong}</td>
                            <td className="px-4 py-2 text-sm">{formatCurrency(item.donGia)}</td>
                            <td className="px-4 py-2 text-sm font-medium">{formatCurrency(item.thanhTien)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sản phẩm */}
              {selectedInvoice.chiTietSanPhams && selectedInvoice.chiTietSanPhams.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Sản phẩm</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedInvoice.chiTietSanPhams.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm">
                              <div>
                                <div className="font-medium">{item.sanPham?.tenSanPham}</div>
                                <div className="text-gray-500 text-xs">{item.sanPham?.moTa}</div>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {item.sanPham?.hinhAnh && (
                                <img
                                  src={item.sanPham.hinhAnh}
                                  alt={item.sanPham.tenSanPham}
                                  className="w-12 h-12 object-cover rounded cursor-pointer"
                                  onClick={() => window.open(item.sanPham?.hinhAnh, '_blank')}
                                />
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm">{item.soLuong}</td>
                            <td className="px-4 py-2 text-sm">{formatCurrency(item.donGia)}</td>
                            <td className="px-4 py-2 text-sm font-medium">{formatCurrency(item.thanhTien)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedInvoice.trangThai)}`}>
                    {selectedInvoice.trangThai}
                  </span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      Tổng tiền: {formatCurrency(selectedInvoice.tongTien)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-3">
                {selectedInvoice.trangThai !== 'Hoàn thành' && (
                  <button
                    onClick={() => {
                      handleComplete(selectedInvoice.maHD);
                      setShowModal(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Hoàn thành
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};