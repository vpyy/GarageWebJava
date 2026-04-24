import React, { useState, useEffect } from 'react';
import { Invoice } from '../../types/invoice';
import { invoiceService } from '../../services/invoiceService';
import { InvoiceDetailModal } from '../../components/admin/InvoiceDetailModal';
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
      setInvoices(data || []);
    } catch (error: any) {
      console.error('Error loading invoices:', error);
      if (error.response?.status === 404)
        toast.error('API hóa đơn không tìm thấy');
      else if (error.response?.status === 500)
        toast.error('Lỗi server khi tải dữ liệu hóa đơn');
      else if (
        error.code === 'NETWORK_ERROR' ||
        error.message?.includes('Network Error')
      )
        toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối.');
      else
        toast.error(
          'Lỗi khi tải dữ liệu hóa đơn: ' + (error.message || 'Unknown error')
        );
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
    } catch {
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

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

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
                {[
                  'Mã HĐ',
                  'Khách hàng',
                  'Xe',
                  'Ngày lập',
                  'Tổng tiền',
                  'Trạng thái',
                  'Thao tác',
                ].map(col => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map(invoice => (
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
                      <span className="text-sm text-gray-500">
                        Đơn hàng sản phẩm
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(invoice.ngayLap)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.tongTien)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.trangThai)}`}
                    >
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
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Chưa có hóa đơn nào
            </h3>
            <p className="text-gray-500 mb-4">
              Hệ thống chưa có dữ liệu hóa đơn để hiển thị
            </p>
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
        <InvoiceDetailModal
          invoice={selectedInvoice}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
          onComplete={handleComplete}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
