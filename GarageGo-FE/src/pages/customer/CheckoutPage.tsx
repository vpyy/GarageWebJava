import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { clearCart } from '../../store/slices/cartSlice';
import { apiService } from '../../services/api';
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
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [submitting, setSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    hoTen: '',
    soDienThoai: '',
    email: '',
    diaChi: '',
    ghiChu: '',
    phuongThucThanhToan: 'COD',
  });

  const totalAmount = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const fmt = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  useEffect(() => {
    if (cartItems.length === 0) navigate('/customer/cart');
  }, [cartItems, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để đặt hàng');
      navigate('/auth/login');
      return;
    }
    setSubmitting(true);
    try {
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
          donGia: item.price,
        })),
        tongTien: totalAmount,
      };
      // Dùng apiService để tự động gửi JWT token
      await apiService.post('/don-hang', orderData);
      dispatch(clearCart());
      setShowDialog(false);
      toast.success('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
      navigate('/customer/orders');
    } catch {
      toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <div style={{ minHeight: '80vh', background: '#f8fafc', padding: '2.5rem 1rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Tiêu đề */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            <i className="fas fa-shopping-cart me-2" style={{ color: '#0ea5e9' }} />
            Giỏ hàng của bạn
          </h2>
          <p style={{ color: '#64748b', marginTop: '6px', fontSize: '14px' }}>
            {cartItems.length} sản phẩm trong giỏ hàng
          </p>
        </div>

        {/* Danh sách sản phẩm */}
        <div
          style={{
            background: 'white', borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            marginBottom: '20px', overflow: 'hidden',
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
            <span style={{ fontWeight: 700, color: '#374151', fontSize: '15px' }}>
              <i className="fas fa-box me-2" style={{ color: '#0ea5e9' }} />
              Chi tiết đơn hàng
            </span>
          </div>

          {cartItems.map((item: any, idx: number) => (
            <div
              key={item.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px 20px',
                borderBottom: idx < cartItems.length - 1 ? '1px solid #f1f5f9' : 'none',
              }}
            >
              <img
                src={item.image || 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'}
                alt={item.name}
                style={{ width: '68px', height: '68px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>{item.name}</div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                  Đơn giá: {fmt(item.price)} × {item.quantity}
                </div>
              </div>
              <div style={{ fontWeight: 800, color: '#0ea5e9', fontSize: '17px', flexShrink: 0 }}>
                {fmt(item.price * item.quantity)}
              </div>
            </div>
          ))}

          {/* Tổng cộng */}
          <div
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#64748b' }}>
              <span>
                <i className="fas fa-truck me-1" style={{ color: '#22c55e' }} />
                Phí vận chuyển: <strong style={{ color: '#22c55e' }}>Miễn phí</strong>
              </span>
              <span>
                <i className="fas fa-receipt me-1" style={{ color: '#0ea5e9' }} />
                {cartItems.length} sản phẩm
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '2px' }}>Tổng thanh toán</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0ea5e9' }}>{fmt(totalAmount)}</div>
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => navigate('/customer/products')}
            style={{
              padding: '12px 24px', background: 'white',
              color: '#64748b', border: '1px solid #e5e7eb',
              borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px',
            }}
          >
            <i className="fas fa-arrow-left me-2" />Tiếp tục mua sắm
          </button>
          <button
            onClick={() => setShowDialog(true)}
            style={{
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
              color: 'white', border: 'none', borderRadius: '10px',
              fontWeight: 700, cursor: 'pointer', fontSize: '15px',
              boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
            }}
          >
            <i className="fas fa-credit-card me-2" />Tiến hành đặt hàng
          </button>
        </div>
      </div>

      {/* Dialog đặt hàng */}
      {showDialog && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
            zIndex: 9999, display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '1rem',
          }}
          onClick={() => setShowDialog(false)}
        >
          <div
            style={{
              background: 'white', borderRadius: '20px',
              width: '100%', maxWidth: '700px',
              maxHeight: '92vh', overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '22px 28px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                borderRadius: '20px 20px 0 0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontWeight: 800, color: 'white', fontSize: '20px' }}>
                  <i className="fas fa-clipboard-list me-2" />Thông tin đặt hàng
                </h3>
                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                  Vui lòng điền đầy đủ thông tin giao hàng
                </p>
              </div>
              <button
                onClick={() => setShowDialog(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)', border: 'none',
                  color: 'white', width: '36px', height: '36px',
                  borderRadius: '50%', cursor: 'pointer', fontSize: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '28px' }}>

              {/* Section: Thông tin liên hệ */}
              <div style={{ marginBottom: '28px' }}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '16px', paddingBottom: '10px',
                    borderBottom: '2px solid #f1f5f9',
                  }}
                >
                  <div
                    style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <i className="fas fa-user" style={{ color: 'white', fontSize: '12px' }} />
                  </div>
                  <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>
                    Thông tin liên hệ
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Họ và tên <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      style={{
                        width: '100%', padding: '10px 14px',
                        border: '1.5px solid #e5e7eb', borderRadius: '10px',
                        fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                      }}
                      type="text"
                      value={form.hoTen}
                      onChange={e => setForm({ ...form, hoTen: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      required
                      onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                      onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Số điện thoại <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      style={{
                        width: '100%', padding: '10px 14px',
                        border: '1.5px solid #e5e7eb', borderRadius: '10px',
                        fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                      }}
                      type="tel"
                      value={form.soDienThoai}
                      onChange={e => setForm({ ...form, soDienThoai: e.target.value })}
                      placeholder="0901 234 567"
                      required
                      onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                      onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    style={{
                      width: '100%', padding: '10px 14px',
                      border: '1.5px solid #e5e7eb', borderRadius: '10px',
                      fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                    }}
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="example@email.com"
                    required
                    onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                </div>
              </div>

              {/* Section: Địa chỉ giao hàng */}
              <div style={{ marginBottom: '28px' }}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '16px', paddingBottom: '10px',
                    borderBottom: '2px solid #f1f5f9',
                  }}
                >
                  <div
                    style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <i className="fas fa-map-marker-alt" style={{ color: 'white', fontSize: '12px' }} />
                  </div>
                  <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>
                    Địa chỉ giao hàng
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Địa chỉ nhận hàng <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    style={{
                      width: '100%', padding: '10px 14px',
                      border: '1.5px solid #e5e7eb', borderRadius: '10px',
                      fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                      resize: 'none',
                    }}
                    rows={2}
                    value={form.diaChi}
                    onChange={e => setForm({ ...form, diaChi: e.target.value })}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                    required
                    onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                </div>

                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Ghi chú đơn hàng
                  </label>
                  <textarea
                    style={{
                      width: '100%', padding: '10px 14px',
                      border: '1.5px solid #e5e7eb', borderRadius: '10px',
                      fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                      resize: 'none',
                    }}
                    rows={2}
                    value={form.ghiChu}
                    onChange={e => setForm({ ...form, ghiChu: e.target.value })}
                    placeholder="Ghi chú thêm về đơn hàng (tùy chọn)..."
                    onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                </div>
              </div>

              {/* Section: Phương thức thanh toán */}
              <div style={{ marginBottom: '28px' }}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '16px', paddingBottom: '10px',
                    borderBottom: '2px solid #f1f5f9',
                  }}
                >
                  <div
                    style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <i className="fas fa-credit-card" style={{ color: 'white', fontSize: '12px' }} />
                  </div>
                  <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>
                    Phương thức thanh toán
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    {
                      value: 'COD',
                      icon: 'fa-money-bill-wave',
                      color: '#22c55e',
                      bg: '#f0fdf4',
                      label: 'Tiền mặt (COD)',
                      sub: 'Thanh toán khi nhận hàng',
                    },
                    {
                      value: 'ChuyenKhoan',
                      icon: 'fa-university',
                      color: '#0ea5e9',
                      bg: '#f0f9ff',
                      label: 'Chuyển khoản',
                      sub: 'Internet Banking / QR Code',
                    },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '16px',
                        border: `2px solid ${form.phuongThucThanhToan === opt.value ? opt.color : '#e5e7eb'}`,
                        borderRadius: '12px', cursor: 'pointer',
                        background: form.phuongThucThanhToan === opt.value ? opt.bg : 'white',
                        transition: 'all 0.2s',
                      }}
                    >
                      <input
                        type="radio"
                        name="pttt"
                        value={opt.value}
                        checked={form.phuongThucThanhToan === opt.value}
                        onChange={() => setForm({ ...form, phuongThucThanhToan: opt.value })}
                        style={{ display: 'none' }}
                      />
                      <div
                        style={{
                          width: '44px', height: '44px', borderRadius: '12px',
                          background: `${opt.color}20`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <i className={`fas ${opt.icon}`} style={{ color: opt.color, fontSize: '20px' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>{opt.label}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{opt.sub}</div>
                      </div>
                      {form.phuongThucThanhToan === opt.value && (
                        <i className="fas fa-check-circle" style={{ color: opt.color, marginLeft: 'auto', fontSize: '18px' }} />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Tóm tắt đơn hàng */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  borderRadius: '12px', padding: '16px 20px',
                  marginBottom: '24px',
                  border: '1px solid #bae6fd',
                }}
              >
                <div style={{ fontWeight: 700, color: '#0369a1', marginBottom: '10px', fontSize: '14px' }}>
                  <i className="fas fa-receipt me-2" />Tóm tắt đơn hàng
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b', marginBottom: '6px' }}>
                  <span>Tạm tính ({cartItems.length} sản phẩm)</span>
                  <span>{fmt(totalAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b', marginBottom: '10px' }}>
                  <span>Phí vận chuyển</span>
                  <span style={{ color: '#22c55e', fontWeight: 600 }}>Miễn phí</span>
                </div>
                <div
                  style={{
                    display: 'flex', justifyContent: 'space-between',
                    paddingTop: '10px', borderTop: '1px solid #bae6fd',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>Tổng thanh toán</span>
                  <span style={{ fontWeight: 800, color: '#0ea5e9', fontSize: '20px' }}>{fmt(totalAmount)}</span>
                </div>
              </div>

              {/* Nút submit */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  style={{
                    flex: 1, padding: '13px',
                    background: 'white', color: '#64748b',
                    border: '1.5px solid #e5e7eb', borderRadius: '10px',
                    fontWeight: 600, cursor: 'pointer', fontSize: '14px',
                  }}
                >
                  <i className="fas fa-arrow-left me-2" />Quay lại
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 2, padding: '13px',
                    background: submitting
                      ? '#94a3b8'
                      : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                    color: 'white', border: 'none', borderRadius: '10px',
                    fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                    fontSize: '15px',
                    boxShadow: submitting ? 'none' : '0 4px 12px rgba(14,165,233,0.35)',
                  }}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle me-2" />
                      Xác nhận đặt hàng
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
