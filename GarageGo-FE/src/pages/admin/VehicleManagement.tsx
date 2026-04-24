import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleCreateRequest } from '../../types/vehicle';
import { vehicleService } from '../../services/vehicleService';
import { customerService } from '../../services/customerService';
import { Customer } from '../../types/customer';
import toast from 'react-hot-toast';

export const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<VehicleCreateRequest>({
    bienSo: '',
    hangXe: '',
    doiXe: new Date().getFullYear(),
    mauXe: '',
    maKH: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vehiclesData, customersData] = await Promise.all([
        vehicleService.getAll(),
        customerService.getCustomers(),
      ]);
      setVehicles(vehiclesData);
      setCustomers(customersData);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await vehicleService.update(editingVehicle.maXe, {
          ...formData,
          maXe: editingVehicle.maXe,
        });
        toast.success('Cập nhật xe thành công');
      } else {
        await vehicleService.create(formData);
        toast.success('Thêm xe thành công');
      }
      setShowModal(false);
      setEditingVehicle(null);
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      bienSo: vehicle.bienSo,
      hangXe: vehicle.hangXe || '',
      doiXe: vehicle.doiXe || new Date().getFullYear(),
      mauXe: vehicle.mauXe || '',
      maKH: vehicle.maKH,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa xe này?')) {
      try {
        await vehicleService.delete(id);
        toast.success('Xóa xe thành công');
        loadData();
      } catch (error: any) {
        toast.error(error.response?.data || 'Có lỗi xảy ra');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      bienSo: '',
      hangXe: '',
      doiXe: new Date().getFullYear(),
      mauXe: '',
      maKH: 0,
    });
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    resetForm();
    setShowModal(true);
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
        <h3 className="text-2xl font-bold text-gray-800">Quản lý xe</h3>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Thêm xe
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Biển số
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hãng xe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đời xe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Màu xe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map(vehicle => (
              <tr key={vehicle.maXe}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {vehicle.bienSo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vehicle.hangXe || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vehicle.doiXe || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vehicle.mauXe || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vehicle.khachHang?.tenKH || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.maXe)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingVehicle ? 'Sửa xe' : 'Thêm xe mới'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biển số
                  </label>
                  <input
                    type="text"
                    value={formData.bienSo}
                    onChange={e =>
                      setFormData({ ...formData, bienSo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hãng xe
                  </label>
                  <input
                    type="text"
                    value={formData.hangXe}
                    onChange={e =>
                      setFormData({ ...formData, hangXe: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đời xe
                  </label>
                  <input
                    type="number"
                    value={formData.doiXe}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        doiXe: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Màu xe
                  </label>
                  <input
                    type="text"
                    value={formData.mauXe}
                    onChange={e =>
                      setFormData({ ...formData, mauXe: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khách hàng
                  </label>
                  <select
                    value={formData.maKH}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        maKH: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={0}>Chọn khách hàng</option>
                    {customers.map(customer => (
                      <option key={customer.maKH} value={customer.maKH}>
                        {customer.tenKH} - {customer.sdt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    {editingVehicle ? 'Cập nhật' : 'Thêm'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
