import React, { useState, useEffect } from 'react';
import { ServiceRequest } from '../../types/request';
import { Service } from '../../types/service';
import { requestService } from '../../services/requestService';
import { serviceService } from '../../services/serviceService';
import toast from 'react-hot-toast';

export const RequestManagement: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [requestsData, servicesData] = await Promise.all([
        requestService.getAll(),
        serviceService.getAll()
      ]);
      setRequests(requestsData);
      setServices(servicesData);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const request = requests.find(r => r.maYeuCau === id);
      if (!request) return;

      await requestService.update(id, {
        maYeuCau: id,
        tenKhachHang: request.tenKhachHang,
        soDienThoai: request.soDienThoai,
        email: request.email,
        diaChi: request.diaChi,
        maDV: request.maDV,
        trangThai: newStatus,
        ghiChu: request.ghiChu
      });
      
      toast.success('Cập nhật trạng thái thành công');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) {
      try {
        await requestService.delete(id);
        toast.success('Xóa yêu cầu thành công');
        loadData();
      } catch (error: any) {
        toast.error(error.response?.data || 'Có lỗi xảy ra');
      }
    }
  };

  const viewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'mới':
        return 'bg-blue-100 text-blue-800';
      case 'đang xử lý':
        return 'bg-yellow-100 text-yellow-800';
      case 'hoàn thành':
        return 'bg-green-100 text-green-800';
      case 'hủy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <h3 className="text-2xl font-bold text-gray-800">Quản lý yêu cầu dịch vụ</h3>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dịch vụ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày yêu cầu
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
            {requests.map((request) => (
              <tr key={request.maYeuCau}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {request.tenKhachHang}
                  </div>
                  <div className="text-sm text-gray-500">
                    {request.diaChi}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{request.soDienThoai}</div>
                  <div className="text-sm text-gray-500">{request.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.dichVu?.tenDichVu || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(request.ngayYeuCau)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={request.trangThai}
                    onChange={(e) => handleUpdateStatus(request.maYeuCau, e.target.value)}
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(request.trangThai)}`}
                  >
                    <option value="Mới">Mới</option>
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Hủy">Hủy</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => viewDetails(request)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(request.maYeuCau)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Chi tiết yêu cầu dịch vụ
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Khách hàng:</label>
                  <p className="text-sm text-gray-900">{selectedRequest.tenKhachHang}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số điện thoại:</label>
                  <p className="text-sm text-gray-900">{selectedRequest.soDienThoai}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email:</label>
                  <p className="text-sm text-gray-900">{selectedRequest.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ:</label>
                  <p className="text-sm text-gray-900">{selectedRequest.diaChi}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dịch vụ:</label>
                  <p className="text-sm text-gray-900">{selectedRequest.dichVu?.tenDichVu}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày yêu cầu:</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedRequest.ngayYeuCau)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái:</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequest.trangThai)}`}>
                    {selectedRequest.trangThai}
                  </span>
                </div>
                {selectedRequest.ghiChu && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ghi chú:</label>
                    <p className="text-sm text-gray-900">{selectedRequest.ghiChu}</p>
                  </div>
                )}
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
  );
};