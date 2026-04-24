import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { RootState } from '../../store';
import toast from 'react-hot-toast';

interface Product {
  maSP: number;
  tenSP: string;
  donGia: number;
  moTa: string;
  hinhAnh: string;
  soLuongTon: number;
  donVi?: string;
}

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) fetchProduct(Number(id));
  }, [id]);

  const fetchProduct = async (productId: number) => {
    try {
      const res = await fetch(`/api/san-pham/${productId}`);
      if (res.ok) setProduct(await res.json());
      else navigate('/customer/products');
    } catch {
      navigate('/customer/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/auth/login');
      return;
    }
    dispatch(
      addToCart({
        id: product.maSP,
        name: product.tenSP,
        price: product.donGia,
        quantity,
        image: product.hinhAnh,
        stock: product.soLuongTon,
        isAuthenticated,
      })
    );
    toast.success('Đã thêm vào giỏ hàng!');
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div style={{ minHeight: '80vh', background: '#f8fafc', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '1.5rem', fontSize: '14px', color: '#64748b' }}>
          <span
            onClick={() => navigate('/customer/products')}
            style={{ cursor: 'pointer', color: '#0ea5e9' }}
          >
            Sản phẩm
          </span>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: '#1e293b', fontWeight: 600 }}>{product.tenSP}</span>
        </nav>

        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 0,
          }}
        >
          {/* Ảnh sản phẩm */}
          <div style={{ position: 'relative', background: '#f1f5f9' }}>
            <img
              src={product.hinhAnh || 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'}
              alt={product.tenSP}
              style={{ width: '100%', height: '420px', objectFit: 'cover' }}
            />
            {product.soLuongTon > 0 ? (
              <span
                style={{
                  position: 'absolute', top: '16px', left: '16px',
                  background: '#22c55e', color: 'white',
                  padding: '6px 14px', borderRadius: '20px',
                  fontSize: '13px', fontWeight: 600,
                }}
              >
                <i className="fas fa-check me-1" />Còn hàng
              </span>
            ) : (
              <span
                style={{
                  position: 'absolute', top: '16px', left: '16px',
                  background: '#ef4444', color: 'white',
                  padding: '6px 14px', borderRadius: '20px',
                  fontSize: '13px', fontWeight: 600,
                }}
              >
                Hết hàng
              </span>
            )}
          </div>

          {/* Thông tin sản phẩm */}
          <div style={{ padding: '2.5rem' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>
              {product.tenSP}
            </h1>

            <div style={{ fontSize: '32px', fontWeight: 800, color: '#0ea5e9', marginBottom: '20px' }}>
              {fmt(product.donGia)}
              {product.donVi && (
                <span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: 400, marginLeft: '8px' }}>
                  / {product.donVi}
                </span>
              )}
            </div>

            {/* Thông tin nhanh */}
            <div
              style={{
                background: '#f8fafc', borderRadius: '12px',
                padding: '16px', marginBottom: '20px',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Tồn kho</div>
                <div style={{ fontWeight: 700, color: product.soLuongTon > 10 ? '#22c55e' : '#f59e0b' }}>
                  {product.soLuongTon} {product.donVi || 'sản phẩm'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Đơn vị</div>
                <div style={{ fontWeight: 700, color: '#1e293b' }}>{product.donVi || 'Cái'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Mã sản phẩm</div>
                <div style={{ fontWeight: 700, color: '#1e293b' }}>SP-{String(product.maSP).padStart(4, '0')}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Trạng thái</div>
                <div style={{ fontWeight: 700, color: product.soLuongTon > 0 ? '#22c55e' : '#ef4444' }}>
                  {product.soLuongTon > 0 ? 'Còn hàng' : 'Hết hàng'}
                </div>
              </div>
            </div>

            {/* Mô tả */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                Mô tả sản phẩm
              </div>
              <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: '14px' }}>{product.moTa}</p>
            </div>

            {/* Chọn số lượng */}
            {product.soLuongTon > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>
                  Số lượng
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{
                      width: '36px', height: '36px', border: '1px solid #e5e7eb',
                      borderRadius: '8px', background: 'white', cursor: 'pointer',
                      fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    −
                  </button>
                  <span style={{ fontSize: '18px', fontWeight: 700, minWidth: '32px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.soLuongTon, q + 1))}
                    style={{
                      width: '36px', height: '36px', border: '1px solid #e5e7eb',
                      borderRadius: '8px', background: 'white', cursor: 'pointer',
                      fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    +
                  </button>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                    (Tối đa {product.soLuongTon})
                  </span>
                </div>
              </div>
            )}

            {/* Nút hành động */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAddToCart}
                disabled={product.soLuongTon <= 0}
                style={{
                  flex: 1, padding: '14px',
                  background: product.soLuongTon > 0
                    ? 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)'
                    : '#e5e7eb',
                  color: product.soLuongTon > 0 ? 'white' : '#9ca3af',
                  border: 'none', borderRadius: '10px',
                  fontWeight: 700, fontSize: '15px', cursor: product.soLuongTon > 0 ? 'pointer' : 'not-allowed',
                }}
              >
                <i className="fas fa-cart-plus me-2" />
                {product.soLuongTon > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
              </button>
              <button
                onClick={() => navigate('/customer/products')}
                style={{
                  padding: '14px 20px', background: '#f1f5f9',
                  color: '#64748b', border: 'none', borderRadius: '10px',
                  fontWeight: 600, cursor: 'pointer',
                }}
              >
                <i className="fas fa-arrow-left" />
              </button>
            </div>

            {/* Cam kết */}
            <div
              style={{
                marginTop: '20px', padding: '14px',
                background: '#f0fdf4', borderRadius: '10px',
                display: 'flex', gap: '16px', flexWrap: 'wrap',
              }}
            >
              {[
                { icon: 'fa-shield-alt', text: 'Hàng chính hãng' },
                { icon: 'fa-undo', text: 'Đổi trả 7 ngày' },
                { icon: 'fa-shipping-fast', text: 'Giao hàng nhanh' },
              ].map(item => (
                <div key={item.icon} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#16a34a' }}>
                  <i className={`fas ${item.icon}`} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
