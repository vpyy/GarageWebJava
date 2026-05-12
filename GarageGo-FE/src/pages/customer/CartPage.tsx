import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  clearError,
} from '../../store/slices/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

export const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, error } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Checkbox chọn sản phẩm
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // Chọn tất cả khi items thay đổi
  useEffect(() => {
    setSelected(new Set(items.map(i => i.id)));
  }, [items.length]);

  useEffect(() => {
    if (!isAuthenticated) navigate('/auth/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map(i => i.id)));
    }
  };

  const selectedItems = items.filter(i => selected.has(i.id));
  const selectedTotal = selectedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const handleRemoveItem = (id: number, name: string) => {
    dispatch(removeFromCart(id));
    setSelected(prev => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
    toast.success(`Đã xóa "${name}" khỏi giỏ hàng`);
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    if (window.confirm('Xóa tất cả sản phẩm trong giỏ hàng?')) {
      dispatch(clearCart());
      setSelected(new Set());
      toast.success('Đã xóa tất cả sản phẩm');
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán');
      return;
    }
    // Lưu các sản phẩm được chọn vào sessionStorage để CheckoutPage dùng
    sessionStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
    navigate('/customer/checkout');
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <style>{`
        .cart-wrap {
          background: #f1f5f9;
          min-height: 80vh;
          padding: 0 0 3rem;
        }
        .cart-hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem 0;
          margin-bottom: 2rem;
        }
        .cart-hero h1 { font-size: 1.8rem; font-weight: 800; margin: 0 0 4px; }
        .cart-hero p { margin: 0; opacity: 0.85; font-size: 14px; }

        .cart-inner {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 16px;
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 20px;
          align-items: start;
        }

        .cart-box {
          background: white;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .cart-box-head {
          padding: 14px 18px;
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          color: #374151;
          font-size: 14px;
        }

        .c-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-bottom: 1px solid #f8fafc;
          transition: background 0.12s;
        }
        .c-item:last-child { border-bottom: none; }
        .c-item:hover { background: #fafbfc; }

        .c-item img {
          width: 64px; height: 64px;
          object-fit: cover; border-radius: 10px;
          border: 1px solid #e5e7eb; flex-shrink: 0;
        }
        .c-item-info { flex: 1; min-width: 0; }
        .c-item-name {
          font-weight: 700; color: #1e293b; font-size: 14px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 3px;
        }
        .c-item-unit { font-size: 12px; color: #94a3b8; }

        .qty-wrap { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
        .qty-btn {
          width: 28px; height: 28px; border-radius: 7px;
          border: 1.5px solid #e5e7eb; background: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #374151; transition: all 0.12s;
        }
        .qty-btn:hover:not(:disabled) { border-color: #0ea5e9; color: #0ea5e9; }
        .qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .qty-num {
          width: 38px; height: 28px; text-align: center;
          border: 1.5px solid #e5e7eb; border-radius: 7px;
          font-size: 13px; font-weight: 700; outline: none;
        }

        .c-item-total {
          font-weight: 800; color: #0ea5e9; font-size: 15px;
          min-width: 80px; text-align: right; flex-shrink: 0;
        }
        .del-btn {
          width: 30px; height: 30px; border-radius: 7px;
          border: 1.5px solid #fee2e2; background: #fff5f5;
          color: #ef4444; cursor: pointer; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.12s;
        }
        .del-btn:hover { background: #ef4444; color: white; border-color: #ef4444; }

        .chk { width: 17px; height: 17px; cursor: pointer; accent-color: #0ea5e9; flex-shrink: 0; }

        /* Summary */
        .sum-box {
          background: white;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
          position: sticky;
          top: 80px;
        }
        .sum-head {
          padding: 14px 18px;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          color: white; font-weight: 700; font-size: 14px;
        }
        .sum-body { padding: 18px; }
        .sum-row {
          display: flex; justify-content: space-between;
          padding: 7px 0; font-size: 13px; color: #64748b;
          border-bottom: 1px solid #f8fafc;
        }
        .sum-total {
          display: flex; justify-content: space-between;
          padding: 12px 0 0; font-weight: 800;
          font-size: 17px; color: #1e293b;
        }
        .sum-total .amt { color: #0ea5e9; }

        .btn-checkout {
          display: block; width: 100%; padding: 12px;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          color: white; border: none; border-radius: 10px;
          font-weight: 700; font-size: 14px; cursor: pointer;
          margin-top: 16px; text-align: center;
          box-shadow: 0 4px 12px rgba(14,165,233,0.3);
          transition: opacity 0.15s;
        }
        .btn-checkout:hover { opacity: 0.9; }
        .btn-checkout:disabled { background: #94a3b8; box-shadow: none; cursor: not-allowed; }

        .btn-continue {
          display: block; width: 100%; padding: 10px;
          background: white; color: #64748b;
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          font-weight: 600; font-size: 13px; cursor: pointer;
          margin-top: 8px; text-align: center; text-decoration: none;
          transition: border-color 0.15s;
        }
        .btn-continue:hover { border-color: #0ea5e9; color: #0ea5e9; }

        .pledge {
          margin-top: 14px; padding: 12px;
          background: #f0fdf4; border-radius: 10px;
        }
        .pledge-item {
          display: flex; align-items: center; gap: 7px;
          font-size: 12px; color: #16a34a; margin-bottom: 5px;
        }
        .pledge-item:last-child { margin-bottom: 0; }

        .empty-wrap {
          max-width: 960px; margin: 0 auto; padding: 0 16px;
        }
        .empty-box {
          background: white; border-radius: 14px;
          padding: 4rem 2rem; text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
      `}</style>

      <div className="cart-hero">
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 16px' }}>
          <h1>
            <i className="fas fa-shopping-cart me-2" />
            Giỏ hàng
          </h1>
          <p>
            {items.length > 0
              ? `${items.length} sản phẩm · ${selected.size} đã chọn`
              : 'Giỏ hàng đang trống'}
          </p>
        </div>
      </div>

      <div className="cart-wrap">
        {items.length > 0 ? (
          <div className="cart-inner">
            {/* Danh sách */}
            <div>
              <div className="cart-box">
                <div className="cart-box-head">
                  <input
                    type="checkbox"
                    className="chk"
                    checked={selected.size === items.length && items.length > 0}
                    onChange={toggleAll}
                    title="Chọn tất cả"
                  />
                  <i className="fas fa-box" style={{ color: '#0ea5e9' }} />
                  Sản phẩm ({items.length})
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: '12px',
                      color: '#94a3b8',
                      fontWeight: 400,
                    }}
                  >
                    Đã chọn {selected.size}/{items.length}
                  </span>
                </div>

                {items.map(item => (
                  <div key={item.id} className="c-item">
                    <input
                      type="checkbox"
                      className="chk"
                      checked={selected.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                    <img
                      src={
                        item.image ||
                        'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'
                      }
                      alt={item.name}
                    />
                    <div className="c-item-info">
                      <div className="c-item-name">{item.name}</div>
                      <div className="c-item-unit">
                        {formatCurrency(item.price)} / sản phẩm
                      </div>
                    </div>
                    <div className="qty-wrap">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <i
                          className="fas fa-minus"
                          style={{ fontSize: '9px' }}
                        />
                      </button>
                      <input
                        className="qty-num"
                        type="number"
                        value={item.quantity}
                        onChange={e =>
                          handleUpdateQuantity(
                            item.id,
                            parseInt(e.target.value) || 1
                          )
                        }
                        min="1"
                        max={item.stock || 999}
                      />
                      <button
                        className="qty-btn"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={
                          item.stock ? item.quantity >= item.stock : false
                        }
                      >
                        <i
                          className="fas fa-plus"
                          style={{ fontSize: '9px' }}
                        />
                      </button>
                    </div>
                    <div className="c-item-total">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                    <button
                      className="del-btn"
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      title="Xóa"
                    >
                      <i
                        className="fas fa-trash"
                        style={{ fontSize: '11px' }}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                  <i className="fas fa-info-circle me-1" />
                  Giỏ hàng được lưu tự động, đăng xuất rồi đăng nhập lại vẫn còn
                </span>
                <button
                  onClick={handleClearCart}
                  style={{
                    padding: '7px 14px',
                    background: 'white',
                    border: '1.5px solid #fee2e2',
                    borderRadius: '8px',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  <i className="fas fa-trash me-1" />
                  Xóa tất cả
                </button>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="sum-box">
                <div className="sum-head">
                  <i className="fas fa-receipt me-2" />
                  Tóm tắt đơn hàng
                </div>
                <div className="sum-body">
                  <div className="sum-row">
                    <span>Đã chọn</span>
                    <span style={{ fontWeight: 600, color: '#374151' }}>
                      {selected.size} sản phẩm
                    </span>
                  </div>
                  <div className="sum-row">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(selectedTotal)}</span>
                  </div>
                  <div className="sum-row">
                    <span>Phí vận chuyển</span>
                    <span style={{ color: '#22c55e', fontWeight: 600 }}>
                      Miễn phí
                    </span>
                  </div>
                  <div className="sum-total">
                    <span>Tổng cộng</span>
                    <span className="amt">{formatCurrency(selectedTotal)}</span>
                  </div>

                  <button
                    className="btn-checkout"
                    onClick={handleCheckout}
                    disabled={selected.size === 0}
                  >
                    <i className="fas fa-credit-card me-2" />
                    Thanh toán ({selected.size})
                  </button>

                  <button
                    className="btn-continue"
                    onClick={() => navigate('/customer/products')}
                  >
                    <i className="fas fa-arrow-left me-1" />
                    Tiếp tục mua sắm
                  </button>

                  <div className="pledge">
                    {[
                      { icon: 'fa-shield-alt', text: 'Hàng chính hãng 100%' },
                      { icon: 'fa-truck', text: 'Giao hàng miễn phí' },
                      { icon: 'fa-undo', text: 'Đổi trả trong 7 ngày' },
                    ].map(p => (
                      <div key={p.icon} className="pledge-item">
                        <i className={`fas ${p.icon}`} />
                        <span>{p.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-wrap">
            <div className="empty-box">
              <i
                className="fas fa-shopping-cart fa-4x"
                style={{
                  color: '#cbd5e1',
                  marginBottom: '1.5rem',
                  display: 'block',
                }}
              />
              <h4
                style={{
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: '8px',
                }}
              >
                Giỏ hàng trống
              </h4>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                Hãy thêm sản phẩm vào giỏ hàng.
              </p>
              <button
                onClick={() => navigate('/customer/products')}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                <i className="fas fa-shopping-bag me-2" />
                Mua sắm ngay
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
