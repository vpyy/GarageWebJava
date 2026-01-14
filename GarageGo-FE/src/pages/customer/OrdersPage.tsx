import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { invoiceService } from '../../services/invoiceService';
import { Invoice } from '../../types/invoice';
import toast from 'react-hot-toast';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Invoice | null>(null);
  const [showModal, setShowModal] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Get all invoices and filter by current user's phone number
      const allInvoices = await invoiceService.getAll();
      // Filter orders for current user (assuming we can match by phone or email)
      const userOrders = allInvoices.filter(invoice => 
        invoice.khachHang?.sdt === user?.username || 
        invoice.khachHang?.email === user?.username
      );
      setOrders(userOrders);
    } catch (error) {
      toast.error('Lỗi khi tải lịch sử đơn hàng');
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = async (order: Invoice) => {
    try {
      const detailData = await invoiceService.getById(order.maHD);
      setSelectedOrder(detailData);
      setShowModal(true);
    } catch (error) {
      toast.error('Lỗi khi tải chi tiết đơn hàng');
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
      <div style={{ padding: '2rem', minHeight: '80vh' }}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', minHeight: '80vh' }}>
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Lịch sử đơn hàng</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-shopping-bag text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl text-gray-500 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-400">Hãy mua sắm để tạo đơn hàng đầu tiên của bạn!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.maHD} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Đơn hàng #{order.maHD}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Ngày đặt: {formatDate(order.ngayLap)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.trangThai)}`}>
                      {order.trangThai}
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      {formatCurrency(order.tongTien)}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        Thanh toán: {order.hinhThucTT}
                      </p>
                      {order.xe && (
                        <p className="text-sm text-gray-600">
                          Xe: {order.xe.bienSo} - {order.xe.hangXe}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Chi tiết đơn hàng #{selectedOrder.maHD}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Thông tin đơn hàng</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Ngày đặt:</span> {formatDate(selectedOrder.ngayLap)}</p>
                      <p><span className="font-medium">Trạng thái:</span> 
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.trangThai)}`}>
                          {selectedOrder.trangThai}
                        </span>
                      </p>
                      <p><span className="font-medium">Thanh toán:</span> {selectedOrder.hinhThucTT}</p>
                    </div>
                  </div>

                  {selectedOrder.xe && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Thông tin xe</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Biển số:</span> {selectedOrder.xe.bienSo}</p>
                        <p><span className="font-medium">Hãng xe:</span> {selectedOrder.xe.hangXe}</p>
                        <p><span className="font-medium">Đời xe:</span> {selectedOrder.xe.doiXe}</p>
                        <p><span className="font-medium">Màu xe:</span> {selectedOrder.xe.mauXe}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Services */}
                {selectedOrder.chiTietDichVus && selectedOrder.chiTietDichVus.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Dịch vụ đã sử dụng</h4>
                    <div className="space-y-3">
                      {selectedOrder.chiTietDichVus.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          {item.dichVu?.hinhAnh && (
                            <img
                              src={item.dichVu.hinhAnh}
                              alt={item.dichVu.tenDichVu}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{item.dichVu?.tenDichVu}</h5>
                            <p className="text-sm text-gray-600">{item.dichVu?.moTa}</p>
                            <p className="text-sm text-gray-500">Số lượng: {item.soLuong}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{formatCurrency(item.thanhTien)}</p>
                            <p className="text-sm text-gray-500">{formatCurrency(item.donGia)} x {item.soLuong}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products */}
                {selectedOrder.chiTietSanPhams && selectedOrder.chiTietSanPhams.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Sản phẩm đã mua</h4>
                    <div className="space-y-3">
                      {selectedOrder.chiTietSanPhams.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          {item.sanPham?.hinhAnh && (
                            <img
                              src={item.sanPham.hinhAnh}
                              alt={item.sanPham.tenSanPham}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{item.sanPham?.tenSanPham}</h5>
                            <p className="text-sm text-gray-600">{item.sanPham?.moTa}</p>
                            <p className="text-sm text-gray-500">Số lượng: {item.soLuong}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{formatCurrency(item.thanhTien)}</p>
                            <p className="text-sm text-gray-500">{formatCurrency(item.donGia)} x {item.soLuong}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div></div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        Tổng tiền: {formatCurrency(selectedOrder.tongTien)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
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
    </div>
  );
};