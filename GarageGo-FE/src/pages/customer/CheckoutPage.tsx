import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { clearCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

interface CheckoutForm {
  hoTen: string;
  soDienThoai: string;
  email: string;
  diaChi: string;
  ghiChu: string;
  phuongThucThanhToan: string;
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    hoTen: '',
    soDienThoai: '',
    email: '',
    diaChi: '',
    ghiChu: '',
    phuongThucThanhToan: 'COD'
  });

  const totalAmount = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/customer/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Tạo đơn hàng
      const orderData = {
        hoTen: form.hoTen,
        soDienThoai: form.soDienThoai,
        email: form.email,
        diaChi: form.diaChi,
        ghiChu: form.ghiChu,
        phuongThucThanhToan: form.phuongThucThanhToan,
        sanPhams: cartItems.map((item: any) => ({
          maSP: item.id,
          soLuong: item.quantity,
          donGia: item.price
        })),
        tongTien: totalAmount
      };

      // Gọi API tạo đơn hàng
      const response = await fetch('http://localhost:5102/api/DonHang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        // Xóa giỏ hàng
        dispatch(clearCart());
        
        // Thông báo thành công
        toast.success('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
        navigate('/customer/home');
      } else {
        toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return null; // Will redirect to cart
  }

  return (
    <div className="container py-5" style={{ marginTop: '80px', marginBottom: '50px', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 mb-4">
          <h2 className="text-center mb-2">
            <i className="fas fa-shopping-cart me-2 text-primary"></i>
            Thanh toán đơn hàng
          </h2>
          <p className="text-center text-muted">Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-gradient text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <h5 className="mb-0">
                <i className="fas fa-user-circle me-2"></i>
                Thông tin đặt hàng
              </h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit} id="checkoutForm">
                <div className="mb-4">
                  <h6 className="text-primary mb-3">
                    <i className="fas fa-address-card me-2"></i>
                    Thông tin người nhận
                  </h6>
                  
                  <div className="mb-3">
                    <label htmlFor="hoTen" className="form-label fw-semibold">
                      Họ và tên <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="hoTen"
                      name="hoTen"
                      value={form.hoTen}
                      onChange={handleInputChange}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="soDienThoai" className="form-label fw-semibold">
                        Số điện thoại <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control form-control-lg"
                        id="soDienThoai"
                        name="soDienThoai"
                        value={form.soDienThoai}
                        onChange={handleInputChange}
                        placeholder="0901234567"
                        pattern="[0-9]{10}"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="diaChi" className="form-label fw-semibold">
                      Địa chỉ nhận hàng <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="diaChi"
                      name="diaChi"
                      value={form.diaChi}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="ghiChu" className="form-label fw-semibold">Ghi chú</label>
                    <textarea
                      className="form-control"
                      id="ghiChu"
                      name="ghiChu"
                      value={form.ghiChu}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Ghi chú về đơn hàng (tùy chọn)"
                    />
                  </div>
                </div>

                <hr className="my-4" />

                <div className="mb-4">
                  <h6 className="text-primary mb-3">
                    <i className="fas fa-credit-card me-2"></i>
                    Phương thức thanh toán
                  </h6>
                  
                  <div className="payment-methods">
                    <div className="form-check p-3 mb-3 border rounded" style={{ cursor: 'pointer', backgroundColor: form.phuongThucThanhToan === 'COD' ? '#f0f9ff' : 'white' }}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="phuongThucThanhToan"
                        id="cod"
                        value="COD"
                        checked={form.phuongThucThanhToan === 'COD'}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label w-100" htmlFor="cod" style={{ cursor: 'pointer' }}>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-money-bill-wave text-success fs-4 me-3"></i>
                          <div>
                            <strong className="d-block">Thanh toán khi nhận hàng (COD)</strong>
                            <small className="text-muted">Thanh toán bằng tiền mặt khi nhận hàng</small>
                          </div>
                        </div>
                      </label>
                    </div>
                    
                    <div className="form-check p-3 border rounded" style={{ cursor: 'pointer', backgroundColor: form.phuongThucThanhToan === 'ChuyenKhoan' ? '#f0f9ff' : 'white' }}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="phuongThucThanhToan"
                        id="banking"
                        value="ChuyenKhoan"
                        checked={form.phuongThucThanhToan === 'ChuyenKhoan'}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label w-100" htmlFor="banking" style={{ cursor: 'pointer' }}>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-university text-primary fs-4 me-3"></i>
                          <div>
                            <strong className="d-block">Chuyển khoản ngân hàng</strong>
                            <small className="text-muted">Chuyển khoản qua Internet Banking hoặc QR Code</small>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-lg text-white"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle me-2"></i>
                        Xác nhận đặt hàng
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/customer/cart')}
                    className="btn btn-outline-secondary btn-lg"
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Quay lại giỏ hàng
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: '100px' }}>
            <div className="card-header bg-light border-0">
              <h6 className="mb-0 fw-bold">
                <i className="fas fa-receipt me-2 text-primary"></i>
                Đơn hàng của bạn
              </h6>
            </div>
            <div className="card-body p-4">
              {cartItems.length > 0 ? (
                <>
                  <div className="order-items mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {cartItems.map((item: any) => (
                      <div key={item.id} className="d-flex mb-3 pb-3 border-bottom">
                        <img
                          src={item.image || "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg"}
                          alt={item.name}
                          className="rounded shadow-sm"
                          style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                        />
                        <div className="ms-3 flex-grow-1">
                          <h6 className="mb-1">{item.name}</h6>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">SL: {item.quantity}</small>
                            <span className="fw-bold text-primary">
                              {(item.price * item.quantity).toLocaleString()}₫
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-summary">
                    <div className="d-flex justify-content-between mb-2 pb-2">
                      <span className="text-muted">Tạm tính:</span>
                      <strong>{totalAmount.toLocaleString()}₫</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                      <span className="text-muted">Phí vận chuyển:</span>
                      <strong className="text-success">Miễn phí</strong>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                      <h5 className="mb-0">Tổng cộng:</h5>
                      <h4 className="mb-0 text-danger fw-bold">{totalAmount.toLocaleString()}₫</h4>
                    </div>
                  </div>

                  <div className="alert alert-info mt-3 mb-0" role="alert">
                    <i className="fas fa-info-circle me-2"></i>
                    <small>Đơn hàng sẽ được xử lý trong vòng 24h</small>
                  </div>
                </>
              ) : (
                <p className="text-center text-muted">Giỏ hàng trống</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};