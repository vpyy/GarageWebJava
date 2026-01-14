import React, { useState, useEffect } from 'react';
import { Product } from '../../types/product';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';

interface ProductFormData {
  tenSanPham: string;
  donGia: number;
  soLuongTon: number;
  donVi: string;
  moTa: string;
  hinhAnh: string;
}

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    tenSanPham: '',
    donGia: 0,
    soLuongTon: 0,
    donVi: '',
    moTa: '',
    hinhAnh: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu sản phẩm');
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate data
    if (!formData.tenSanPham || !formData.donVi || !formData.moTa) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (formData.donGia <= 0) {
      toast.error('Đơn giá phải lớn hơn 0');
      return;
    }
    
    if (formData.soLuongTon < 0) {
      toast.error('Số lượng tồn không được âm');
      return;
    }
    
    try {
      if (editingProduct) {
        const updateData = {
          maSP: editingProduct.maSP,
          tenSP: formData.tenSanPham,
          donGia: formData.donGia,
          soLuongTon: formData.soLuongTon,
          donVi: formData.donVi,
          moTa: formData.moTa,
          hinhAnh: formData.hinhAnh || ''
        };
        console.log('Updating product:', updateData);
        await productService.updateProduct(updateData);
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        const createData = {
          tenSP: formData.tenSanPham,
          donGia: formData.donGia,
          soLuongTon: formData.soLuongTon,
          donVi: formData.donVi,
          moTa: formData.moTa,
          hinhAnh: formData.hinhAnh || ''
        };
        console.log('Creating product:', createData);
        await productService.createProduct(createData);
        toast.success('Thêm sản phẩm thành công');
      }
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error: any) {
      console.error('Error submitting product:', error);
      console.error('Error response:', error.response);
      
      // Handle different error types
      if (error.response?.data) {
        // If backend returns validation errors
        if (typeof error.response.data === 'string') {
          toast.error(error.response.data);
        } else if (error.response.data.errors) {
          // ASP.NET validation errors
          const errorMessages = Object.values(error.response.data.errors).flat();
          toast.error(errorMessages.join(', '));
        } else if (error.response.data.title) {
          toast.error(error.response.data.title);
        } else {
          toast.error('Có lỗi xảy ra khi lưu sản phẩm');
        }
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Có lỗi xảy ra');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      tenSanPham: product.tenSP,
      donGia: product.donGia,
      soLuongTon: product.soLuongTon,
      donVi: product.donVi || '',
      moTa: product.moTa || '',
      hinhAnh: product.hinhAnh || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productService.deleteProduct(id);
        toast.success('Xóa sản phẩm thành công');
        loadProducts();
      } catch (error: any) {
        toast.error(error.response?.data || 'Có lỗi xảy ra');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      tenSanPham: '',
      donGia: 0,
      soLuongTon: 0,
      donVi: '',
      moTa: '',
      hinhAnh: ''
    });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { text: 'Hết hàng', class: 'bg-red-100 text-red-800' };
    } else if (stock < 10) {
      return { text: 'Sắp hết', class: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { text: 'Còn hàng', class: 'bg-green-100 text-green-800' };
    }
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
        <h3 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h3>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn vị
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô tả
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
            {products.map((product) => {
              const stockStatus = getStockStatus(product.soLuongTon);
              return (
                <tr key={product.maSP}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.tenSP}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.hinhAnh ? (
                      <img
                        src={product.hinhAnh}
                        alt={product.tenSP}
                        className="w-12 h-12 object-cover rounded cursor-pointer"
                        onClick={() => window.open(product.hinhAnh, '_blank')}
                      />
                    ) : (
                      <span className="text-gray-400">Không có</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(product.donGia)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    {product.soLuongTon}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.donVi}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {product.moTa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.class}`}>
                      {stockStatus.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      title="Sửa"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(product.maSP)}
                      className="text-red-600 hover:text-red-900"
                      title="Xóa"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    value={formData.tenSanPham}
                    onChange={(e) => setFormData({ ...formData, tenSanPham: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đơn giá (VND)
                  </label>
                  <input
                    type="number"
                    value={formData.donGia || ''}
                    onChange={(e) => setFormData({ ...formData, donGia: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    step="1000"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng tồn
                  </label>
                  <input
                    type="number"
                    value={formData.soLuongTon || ''}
                    onChange={(e) => setFormData({ ...formData, soLuongTon: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đơn vị
                  </label>
                  <input
                    type="text"
                    value={formData.donVi}
                    onChange={(e) => setFormData({ ...formData, donVi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cái, Hộp, Chai..."
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.moTa}
                    onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.hinhAnh}
                    onChange={(e) => setFormData({ ...formData, hinhAnh: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.hinhAnh && (
                    <div className="mt-2">
                      <img
                        src={formData.hinhAnh}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    {editingProduct ? 'Cập nhật' : 'Thêm'}
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
