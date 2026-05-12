import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { removeFromCart } from '../../store/slices/cartSlice';
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

const fmt = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    n
  );

const PAYMENT_OPTS = [
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
];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allCartItems = useSelector((state: RootState) => state.cart.items);
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

  const cartItems = (() => {
    try {
      const s = sessionStorage.getItem('checkoutItems');
      if (s) return JSON.parse(s);
    } catch {}
    return allCartItems;
  })();

  const totalAmount = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (cartItems.length === 0) navigate('/customer/cart');
  }, [cartItems, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập');
      navigate('/auth/login');
      return;
    }
    setSubmitting(true);
    try {
      await apiService.post('/don-hang', {
        ...form,
        sanPhams: cartItems.map((i: any) => ({
          maSP: i.id,
          soLuong: i.quantity,
          donGia: i.price,
        })),
        tongTien: totalAmount,
      });
      cartItems.forEach((i: any) => dispatch(removeFromCart(i.id)));
      sessionStorage.removeItem('checkoutItems');
      setShowDialog(false);
      toast.success('Đặt hàng thành công! Cảm ơn bạn.');
      navigate('/customer/orders');
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const inp: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
  };
  const focus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.target.style.borderColor = '#0ea5e9';
    e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.1)';
  };
  const blur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.target.style.borderColor = '#e5e7eb';
    e.target.style.boxShadow = 'none';
  };

  if (cartItems.length === 0) return null;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        .co-hero { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); padding: 3rem 0 5rem; position: relative; overflow: hidden; }
        .co-hero::before { content: ''; position: absolute; top: -30%; right: -10%; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%); }
        .co-body { max-width: 1000px; margin: -2.5rem auto 3rem; padding: 0 1.5rem; position: relative; z-index: 1; }
        .co-grid { display: grid; grid-template-columns: 1fr 360px; gap: 20px; align-items: start; }

        .co-card { background: white; border-radius: 20px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden; }
        .co-card-head { padding: 16px 22px; background: #f8fafc; border-bottom: 1px solid #f1f5f9; font-weight: 700; color: #1e293b; font-size: 15px; display: flex; align-items: center; gap: 8px; }
        .co-card-body { padding: 0; }

        .co-item { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-bottom: 1px solid #f8fafc; }
        .co-item:last-child { border-bottom: none; }
        .co-item img { width: 60px; height: 60px; object-fit: cover; border-radius: 10px; flex-shrink: 0; border: 1px solid #f1f5f9; }
        .co-item-name { font-weight: 700; color: #1e293b; font-size: 14px; margin-bottom: 3px; }
        .co-item-sub { font-size: 12px; color: #94a3b8; }
        .co-item-price { font-weight: 800; color: #0ea5e9; font-size: 15px; flex-shrink: 0; }

        .co-total-bar { padding: 14px 20px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #bae6fd; }
        .co-total-val { font-size: 22px; font-weight: 900; color: #0ea5e9; }

        .co-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; }
        .co-btn-back { padding: '11px 22px'; background: white; color: #64748b; border: '1.5px solid #e5e7eb'; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 6px; }
        .co-btn-primary { padding: 12px 28px; background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 15px; box-shadow: 0 4px 12px rgba(14,165,233,0.3); display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .co-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(14,165,233,0.4); }

        /* Modal */
        .co-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.65); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem; backdrop-filter: blur(4px); }
        .co-modal { background: white; border-radius: 24px; width: 100%; max-width: 680px; max-height: 92vh; overflow: auto; box-shadow: 0 24px 64px rgba(0,0,0,0.2); }
        .co-modal-head { padding: 22px 28px; background: linear-gradient(135deg, #0f172a, #1e3a5f); border-radius: 24px 24px 0 0; display: flex; justify-content: space-between; align-items: center; }
        .co-modal-close { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.15); border: none; color: white; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .co-modal-close:hover { background: rgba(255,255,255,0.25); }
        .co-modal-body { padding: 28px; }

        .co-section-head { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid #f1f5f9; }
        .co-section-icon { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .co-section-title { font-weight: 700; color: #1e293b; font-size: 15px; }

        .co-field { margin-bottom: 16px; }
        .co-label { display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.3px; }

        .co-payment-opt { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border: 2px solid #e5e7eb; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
        .co-payment-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .co-summary-box { background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 14px; padding: 16px 20px; margin-bottom: 22px; border: 1px solid #bae6fd; }
        .co-summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #64748b; margin-bottom: 8px; }
        .co-summary-total { display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #bae6fd; }

        .co-submit-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 6px 20px rgba(14,165,233,0.35); display: flex; align-items: center; justify-content: center; gap: 8px; }
        .co-submit-btn:disabled { background: #94a3b8; box-shadow: none; cursor: not-allowed; }

        @media (max-width: 700px) { .co-grid { grid-template-columns: 1fr; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Hero */}
      <div className="co-hero">
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '0 1.5rem',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i
                className="fas fa-shopping-cart"
                style={{ color: 'white', fontSize: '18px' }}
              />
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: 'white',
                }}
              >
                Xem lại đơn hàng
              </h1>
              <p
                style={{
                  margin: 0,
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '13px',
                }}
              >
                {cartItems.length} sản phẩm đã chọn
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="co-body">
        <div className="co-grid">
          {/* Danh sách sản phẩm */}
          <div>
            <div className="co-card">
              <div className="co-card-head">
                <i className="fas fa-box" style={{ color: '#0ea5e9' }} />
                Sản phẩm đã chọn ({cartItems.length})
              </div>
              <div className="co-card-body">
                {cartItems.map((item: any, idx: number) => (
                  <div
                    key={item.id}
                    className="co-item"
                    style={{ background: idx % 2 === 0 ? 'white' : '#fafafa' }}
                  >
                    <img
                      src={
                        item.image ||
                        'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'
                      }
                      alt={item.name}
                    />
                    <div style={{ flex: 1 }}>
                      <div className="co-item-name">{item.name}</div>
                      <div className="co-item-sub">
                        {fmt(item.price)} × {item.quantity}
                      </div>
                    </div>
                    <div className="co-item-price">
                      {fmt(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
                <div className="co-total-bar">
                  <div
                    style={{
                      display: 'flex',
                      gap: '20px',
                      fontSize: '13px',
                      color: '#64748b',
                    }}
                  >
                    <span>
                      <i
                        className="fas fa-truck me-1"
                        style={{ color: '#22c55e' }}
                      />
                      Miễn phí vận chuyển
                    </span>
                    <span>
                      <i
                        className="fas fa-receipt me-1"
                        style={{ color: '#0ea5e9' }}
                      />
                      {cartItems.length} sản phẩm
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#94a3b8',
                        marginBottom: '2px',
                      }}
                    >
                      Tổng thanh toán
                    </div>
                    <div className="co-total-val">{fmt(totalAmount)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="co-actions">
              <button
                onClick={() => navigate('/customer/cart')}
                style={{
                  padding: '11px 22px',
                  background: 'white',
                  color: '#64748b',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <i className="fas fa-arrow-left" />
                Quay lại giỏ hàng
              </button>
              <button
                onClick={() => setShowDialog(true)}
                className="co-btn-primary"
              >
                <i className="fas fa-credit-card" />
                Tiến hành đặt hàng
              </button>
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="co-card" style={{ position: 'sticky', top: '88px' }}>
            <div className="co-card-head">
              <i className="fas fa-receipt" style={{ color: '#0ea5e9' }} />
              Tóm tắt đơn hàng
            </div>
            <div style={{ padding: '18px' }}>
              {cartItems.map((item: any) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    marginBottom: '8px',
                    color: '#64748b',
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginRight: '8px',
                    }}
                  >
                    {item.name} ×{item.quantity}
                  </span>
                  <span
                    style={{ fontWeight: 600, color: '#374151', flexShrink: 0 }}
                  >
                    {fmt(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div
                style={{
                  height: '1px',
                  background: '#f1f5f9',
                  margin: '12px 0',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  color: '#64748b',
                  marginBottom: '6px',
                }}
              >
                <span>Phí vận chuyển</span>
                <span style={{ color: '#22c55e', fontWeight: 600 }}>
                  Miễn phí
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '2px solid #f1f5f9',
                }}
              >
                <span style={{ fontWeight: 700, color: '#1e293b' }}>
                  Tổng cộng
                </span>
                <span
                  style={{
                    fontWeight: 900,
                    color: '#0ea5e9',
                    fontSize: '20px',
                  }}
                >
                  {fmt(totalAmount)}
                </span>
              </div>
              <button
                onClick={() => setShowDialog(true)}
                className="co-btn-primary"
                style={{
                  width: '100%',
                  marginTop: '16px',
                  justifyContent: 'center',
                }}
              >
                <i className="fas fa-credit-card" />
                Đặt hàng ngay
              </button>
              <div
                style={{
                  marginTop: '14px',
                  padding: '12px',
                  background: '#f0fdf4',
                  borderRadius: '10px',
                }}
              >
                {[
                  { icon: 'fa-shield-alt', text: 'Thanh toán an toàn' },
                  { icon: 'fa-truck', text: 'Giao hàng miễn phí' },
                  { icon: 'fa-undo', text: 'Đổi trả 7 ngày' },
                ].map(p => (
                  <div
                    key={p.icon}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      fontSize: '12px',
                      color: '#16a34a',
                      marginBottom: '5px',
                    }}
                  >
                    <i className={`fas ${p.icon}`} />
                    {p.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog */}
      {showDialog && (
        <div className="co-modal-overlay" onClick={() => setShowDialog(false)}>
          <div className="co-modal" onClick={e => e.stopPropagation()}>
            <div className="co-modal-head">
              <div>
                <div
                  style={{ color: 'white', fontWeight: 800, fontSize: '20px' }}
                >
                  <i className="fas fa-clipboard-list me-2" />
                  Thông tin đặt hàng
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: '13px',
                    marginTop: '4px',
                  }}
                >
                  Điền đầy đủ thông tin để hoàn tất đơn hàng
                </div>
              </div>
              <button
                className="co-modal-close"
                onClick={() => setShowDialog(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="co-modal-body">
              {/* Thông tin liên hệ */}
              <div style={{ marginBottom: '24px' }}>
                <div className="co-section-head">
                  <div
                    className="co-section-icon"
                    style={{
                      background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                    }}
                  >
                    <i
                      className="fas fa-user"
                      style={{ color: 'white', fontSize: '12px' }}
                    />
                  </div>
                  <span className="co-section-title">Thông tin liên hệ</span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '14px',
                  }}
                >
                  <div className="co-field">
                    <label className="co-label">
                      Họ và tên <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      style={inp}
                      type="text"
                      value={form.hoTen}
                      onChange={e =>
                        setForm({ ...form, hoTen: e.target.value })
                      }
                      placeholder="Nguyễn Văn A"
                      required
                      onFocus={focus}
                      onBlur={blur}
                    />
                  </div>
                  <div className="co-field">
                    <label className="co-label">
                      Số điện thoại <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      style={inp}
                      type="tel"
                      value={form.soDienThoai}
                      onChange={e =>
                        setForm({ ...form, soDienThoai: e.target.value })
                      }
                      placeholder="0901 234 567"
                      required
                      onFocus={focus}
                      onBlur={blur}
                    />
                  </div>
                </div>
                <div className="co-field">
                  <label className="co-label">
                    Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    style={inp}
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="example@email.com"
                    required
                    onFocus={focus}
                    onBlur={blur}
                  />
                </div>
              </div>

              {/* Địa chỉ */}
              <div style={{ marginBottom: '24px' }}>
                <div className="co-section-head">
                  <div
                    className="co-section-icon"
                    style={{
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    }}
                  >
                    <i
                      className="fas fa-map-marker-alt"
                      style={{ color: 'white', fontSize: '12px' }}
                    />
                  </div>
                  <span className="co-section-title">Địa chỉ giao hàng</span>
                </div>
                <div className="co-field">
                  <label className="co-label">
                    Địa chỉ nhận hàng{' '}
                    <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    style={{ ...inp, resize: 'none' }}
                    rows={2}
                    value={form.diaChi}
                    onChange={e => setForm({ ...form, diaChi: e.target.value })}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                    required
                    onFocus={focus}
                    onBlur={blur}
                  />
                </div>
                <div className="co-field" style={{ marginBottom: 0 }}>
                  <label className="co-label">Ghi chú</label>
                  <textarea
                    style={{ ...inp, resize: 'none' }}
                    rows={2}
                    value={form.ghiChu}
                    onChange={e => setForm({ ...form, ghiChu: e.target.value })}
                    placeholder="Ghi chú thêm (tùy chọn)..."
                    onFocus={focus}
                    onBlur={blur}
                  />
                </div>
              </div>

              {/* Thanh toán */}
              <div style={{ marginBottom: '24px' }}>
                <div className="co-section-head">
                  <div
                    className="co-section-icon"
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    }}
                  >
                    <i
                      className="fas fa-credit-card"
                      style={{ color: 'white', fontSize: '12px' }}
                    />
                  </div>
                  <span className="co-section-title">
                    Phương thức thanh toán
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  {PAYMENT_OPTS.map(opt => (
                    <label
                      key={opt.value}
                      className="co-payment-opt"
                      style={{
                        border: `2px solid ${form.phuongThucThanhToan === opt.value ? opt.color : '#e5e7eb'}`,
                        background:
                          form.phuongThucThanhToan === opt.value
                            ? opt.bg
                            : 'white',
                      }}
                    >
                      <input
                        type="radio"
                        name="pttt"
                        value={opt.value}
                        checked={form.phuongThucThanhToan === opt.value}
                        onChange={() =>
                          setForm({ ...form, phuongThucThanhToan: opt.value })
                        }
                        style={{ display: 'none' }}
                      />
                      <div
                        className="co-payment-icon"
                        style={{ background: `${opt.color}20` }}
                      >
                        <i
                          className={`fas ${opt.icon}`}
                          style={{ color: opt.color, fontSize: '20px' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: '14px',
                            color: '#1e293b',
                          }}
                        >
                          {opt.label}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#94a3b8',
                            marginTop: '2px',
                          }}
                        >
                          {opt.sub}
                        </div>
                      </div>
                      {form.phuongThucThanhToan === opt.value && (
                        <i
                          className="fas fa-check-circle"
                          style={{ color: opt.color, fontSize: '18px' }}
                        />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="co-summary-box">
                <div
                  style={{
                    fontWeight: 700,
                    color: '#0369a1',
                    marginBottom: '10px',
                    fontSize: '14px',
                  }}
                >
                  <i className="fas fa-receipt me-2" />
                  Tóm tắt
                </div>
                <div className="co-summary-row">
                  <span>Tạm tính ({cartItems.length} sản phẩm)</span>
                  <span>{fmt(totalAmount)}</span>
                </div>
                <div className="co-summary-row">
                  <span>Phí vận chuyển</span>
                  <span style={{ color: '#22c55e', fontWeight: 600 }}>
                    Miễn phí
                  </span>
                </div>
                <div className="co-summary-total">
                  <span
                    style={{
                      fontWeight: 700,
                      color: '#1e293b',
                      fontSize: '15px',
                    }}
                  >
                    Tổng thanh toán
                  </span>
                  <span
                    style={{
                      fontWeight: 900,
                      color: '#0ea5e9',
                      fontSize: '20px',
                    }}
                  >
                    {fmt(totalAmount)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  style={{
                    flex: 1,
                    padding: '13px',
                    background: 'white',
                    color: '#64748b',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  <i className="fas fa-arrow-left me-2" />
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="co-submit-btn"
                  disabled={submitting}
                  style={{ flex: 2 }}
                >
                  {submitting ? (
                    <>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: 'white',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }}
                      />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle" />
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
