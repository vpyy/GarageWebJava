import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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
  const { items, total, error } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleRemoveItem = (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa "${name}" khỏi giỏ hàng?`)) {
      dispatch(removeFromCart(id));
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    }
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    if (
      window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')
    ) {
      dispatch(clearCart());
      toast.success('Đã xóa tất cả sản phẩm trong giỏ hàng');
    }
  };

  const calculateItemTotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <style>{`
        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 3rem 0 2rem;
          margin-bottom: 3rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .cart-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .cart-item {
          padding: 1.5rem;
          border-bottom: 1px solid #f3f4f6;
          transition: all 0.2s ease;
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .cart-item:hover {
          background: #f9fafb;
        }

        .cart-item img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .cart-item h6 {
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .cart-item .text-muted {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .quantity-control input {
          width: 80px;
          text-align: center;
        }

        .summary-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 100px;
        }

        .summary-card .card-header {
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          padding: 1.5rem;
        }

        .summary-card .card-header h5 {
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .summary-card .card-body {
          padding: 1.5rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          color: #6b7280;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          padding: 1rem 0;
          border-top: 2px solid #f3f4f6;
          margin-top: 0.5rem;
          font-weight: 700;
          font-size: 1.2rem;
          color: #1f2937;
        }

        .summary-total .amount {
          color: #0ea5e9;
        }

        .empty-cart {
          text-align: center;
          padding: 5rem 2rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .empty-cart i {
          color: #d1d5db;
          margin-bottom: 1.5rem;
        }

        .empty-cart h4 {
          color: #1f2937;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .empty-cart p {
          color: #6b7280;
          margin-bottom: 2rem;
        }
      `}</style>

      <div className="page-header">
        <div className="container text-center">
          <h1>Giỏ hàng của bạn</h1>
          <p>Xem lại và hoàn tất đơn hàng của bạn</p>
        </div>
      </div>

      <div className="container pb-5">
        {items.length > 0 ? (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="cart-card">
                {items.map((item, index) => (
                  <div key={item.id} className="cart-item">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <img
                        src={
                          item.image ||
                          'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'
                        }
                        alt={item.name}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: '120px' }}>
                        <h6 style={{ margin: 0, fontWeight: 700 }}>
                          {item.name}
                        </h6>
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: '14px' }}
                        >
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div
                        className="quantity-control"
                        style={{ flexShrink: 0 }}
                      >
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <input
                          type="number"
                          className="form-control form-control-sm text-center"
                          value={item.quantity}
                          onChange={e =>
                            handleUpdateQuantity(
                              item.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          min="1"
                          max={item.stock || 999}
                          style={{ width: '60px' }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={
                            item.stock ? item.quantity >= item.stock : false
                          }
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      <div
                        style={{
                          minWidth: '100px',
                          textAlign: 'right',
                          flexShrink: 0,
                        }}
                      >
                        <h6
                          style={{
                            color: '#0ea5e9',
                            margin: 0,
                            fontWeight: 700,
                          }}
                        >
                          {formatCurrency(
                            calculateItemTotal(item.price, item.quantity)
                          )}
                        </h6>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        style={{ flexShrink: 0 }}
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        title="Xóa sản phẩm"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="summary-card">
                <div className="card-header">
                  <h5>
                    <i className="fas fa-receipt me-2"></i>Tổng kết đơn hàng
                  </h5>
                </div>
                <div className="card-body">
                  <div className="summary-row">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Phí vận chuyển:</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>
                      Miễn phí
                    </span>
                  </div>
                  <div className="summary-total">
                    <span>Tổng cộng:</span>
                    <span className="amount">{formatCurrency(total)}</span>
                  </div>
                  <div className="d-grid gap-2 mt-3">
                    <Link
                      to="/customer/checkout"
                      className="btn btn-primary btn-lg"
                    >
                      <i className="fas fa-credit-card me-2"></i>Thanh toán
                    </Link>
                    <Link
                      to="/customer/products"
                      className="btn btn-outline-primary"
                    >
                      <i className="fas fa-arrow-left me-2"></i>Tiếp tục mua sắm
                    </Link>
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="btn btn-outline-danger btn-sm"
                    >
                      <i className="fas fa-trash me-2"></i>Xóa tất cả
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <i className="fas fa-shopping-cart fa-5x"></i>
            <h4>Giỏ hàng trống</h4>
            <p>Hãy thêm một số sản phẩm vào giỏ hàng của bạn.</p>
            <Link to="/customer/products" className="btn btn-primary btn-lg">
              <i className="fas fa-shopping-bag me-2"></i>Mua sắm ngay
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
