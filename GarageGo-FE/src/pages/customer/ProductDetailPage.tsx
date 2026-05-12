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

const fmt = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    n
  );

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (id)
      fetch(`/api/san-pham/${id}`)
        .then(r => (r.ok ? r.json() : null))
        .then(d => {
          if (d) setProduct(d);
          else navigate('/customer/products');
        })
        .catch(() => navigate('/customer/products'))
        .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập');
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
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '3px solid #e2e8f0',
              borderTopColor: '#0ea5e9',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 12px',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Đang tải...</div>
        </div>
      </div>
    );

  if (!product) return null;

  const inStock = product.soLuongTon > 0;
  const lowStock = product.soLuongTon > 0 && product.soLuongTon <= 5;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        .pd-body { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }
        .pd-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #94a3b8; margin-bottom: 1.5rem; }
        .pd-breadcrumb a { color: #0ea5e9; text-decoration: none; font-weight: 600; cursor: pointer; }
        .pd-breadcrumb a:hover { text-decoration: underline; }
        .pd-breadcrumb span { color: #1e293b; font-weight: 600; }

        .pd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }

        /* Image */
        .pd-img-wrap { position: relative; border-radius: 20px; overflow: hidden; background: #f1f5f9; aspect-ratio: 1; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .pd-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
        .pd-img-wrap:hover img { transform: scale(1.04); }
        .pd-img-badge { position: absolute; top: 16px; left: 16px; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; backdrop-filter: blur(8px); }

        /* Info */
        .pd-info { }
        .pd-name { font-size: 1.8rem; font-weight: 900; color: #0f172a; line-height: 1.2; margin-bottom: 8px; }
        .pd-code { font-size: 12px; color: #94a3b8; font-weight: 600; margin-bottom: 16px; }
        .pd-price { font-size: 2.2rem; font-weight: 900; color: #0ea5e9; margin-bottom: 4px; }
        .pd-unit { font-size: 14px; color: #94a3b8; font-weight: 400; }

        .pd-divider { height: 1px; background: #f1f5f9; margin: 20px 0; }

        .pd-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .pd-spec { background: #f8fafc; border-radius: 12px; padding: 14px; border: 1px solid #f1f5f9; }
        .pd-spec-label { font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .pd-spec-val { font-size: 14px; font-weight: 700; color: #1e293b; }

        .pd-desc-title { font-size: 13px; font-weight: 700; color: #374151; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.3px; }
        .pd-desc { font-size: 14px; color: #64748b; line-height: 1.8; margin-bottom: 20px; }

        /* Qty */
        .pd-qty-wrap { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .pd-qty-label { font-size: 13px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.3px; margin-right: 4px; }
        .pd-qty-btn { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid #e5e7eb; background: white; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: #374151; }
        .pd-qty-btn:hover:not(:disabled) { border-color: #0ea5e9; color: #0ea5e9; }
        .pd-qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .pd-qty-num { font-size: 18px; font-weight: 800; min-width: 36px; text-align: center; color: #1e293b; }
        .pd-qty-max { font-size: 12px; color: #94a3b8; }

        /* Buttons */
        .pd-btn-primary { flex: 1; padding: 14px; background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; border: none; border-radius: 12px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s; box-shadow: 0 6px 20px rgba(14,165,233,0.35); display: flex; align-items: center; justify-content: center; gap: 8px; }
        .pd-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(14,165,233,0.45); }
        .pd-btn-primary:disabled { background: #e2e8f0; color: #94a3b8; box-shadow: none; cursor: not-allowed; transform: none; }
        .pd-btn-back { padding: 14px 18px; background: white; color: #64748b; border: 1.5px solid #e5e7eb; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .pd-btn-back:hover { border-color: #0ea5e9; color: #0ea5e9; }

        /* Pledge */
        .pd-pledge { background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 14px; padding: 16px; border: 1px solid #86efac; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 16px; }
        .pd-pledge-item { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #15803d; font-weight: 600; }

        @media (max-width: 700px) { .pd-grid { grid-template-columns: 1fr; } .pd-specs { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <div className="pd-body">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <a onClick={() => navigate('/customer/home')}>Trang chủ</a>
          <i className="fas fa-chevron-right" style={{ fontSize: '10px' }} />
          <a onClick={() => navigate('/customer/products')}>Sản phẩm</a>
          <i className="fas fa-chevron-right" style={{ fontSize: '10px' }} />
          <span>{product.tenSP}</span>
        </div>

        <div className="pd-grid">
          {/* Ảnh */}
          <div className="pd-img-wrap">
            <img
              src={
                product.hinhAnh ||
                'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'
              }
              alt={product.tenSP}
              onLoad={() => setImgLoaded(true)}
              style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
            />
            {!imgLoaded && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
            )}
            <span
              className="pd-img-badge"
              style={{
                background: inStock
                  ? 'rgba(34,197,94,0.9)'
                  : 'rgba(239,68,68,0.9)',
                color: 'white',
              }}
            >
              {inStock
                ? lowStock
                  ? `⚠ Còn ${product.soLuongTon}`
                  : '✓ Còn hàng'
                : '✗ Hết hàng'}
            </span>
            <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
          </div>

          {/* Thông tin */}
          <div className="pd-info">
            <h1 className="pd-name">{product.tenSP}</h1>
            <div className="pd-code">
              Mã SP: SP-{String(product.maSP).padStart(4, '0')}
            </div>

            <div>
              <div className="pd-price">
                {fmt(product.donGia)}
                {product.donVi && (
                  <span className="pd-unit"> / {product.donVi}</span>
                )}
              </div>
              {lowStock && (
                <div
                  style={{
                    fontSize: '13px',
                    color: '#f59e0b',
                    fontWeight: 600,
                    marginTop: '4px',
                  }}
                >
                  ⚠ Chỉ còn {product.soLuongTon} sản phẩm!
                </div>
              )}
            </div>

            <div className="pd-divider" />

            <div className="pd-specs">
              {[
                {
                  label: 'Tồn kho',
                  val: `${product.soLuongTon} ${product.donVi || 'sản phẩm'}`,
                  color: product.soLuongTon > 10 ? '#22c55e' : '#f59e0b',
                },
                {
                  label: 'Đơn vị',
                  val: product.donVi || 'Cái',
                  color: '#1e293b',
                },
                {
                  label: 'Trạng thái',
                  val: inStock ? 'Còn hàng' : 'Hết hàng',
                  color: inStock ? '#22c55e' : '#ef4444',
                },
                { label: 'Danh mục', val: 'Phụ tùng ô tô', color: '#1e293b' },
              ].map(s => (
                <div key={s.label} className="pd-spec">
                  <div className="pd-spec-label">{s.label}</div>
                  <div className="pd-spec-val" style={{ color: s.color }}>
                    {s.val}
                  </div>
                </div>
              ))}
            </div>

            <div className="pd-desc-title">Mô tả sản phẩm</div>
            <div className="pd-desc">{product.moTa}</div>

            {inStock && (
              <div className="pd-qty-wrap">
                <span className="pd-qty-label">Số lượng:</span>
                <button
                  className="pd-qty-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="pd-qty-num">{quantity}</span>
                <button
                  className="pd-qty-btn"
                  onClick={() =>
                    setQuantity(q => Math.min(product.soLuongTon, q + 1))
                  }
                  disabled={quantity >= product.soLuongTon}
                >
                  +
                </button>
                <span className="pd-qty-max">
                  (Tối đa {product.soLuongTon})
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="pd-btn-primary"
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                <i className="fas fa-cart-plus" />
                {inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
              </button>
              <button
                className="pd-btn-back"
                onClick={() => navigate('/customer/products')}
              >
                <i className="fas fa-arrow-left" />
              </button>
            </div>

            <div className="pd-pledge">
              {[
                { icon: 'fa-shield-alt', text: 'Hàng chính hãng 100%' },
                { icon: 'fa-undo', text: 'Đổi trả trong 7 ngày' },
                { icon: 'fa-shipping-fast', text: 'Giao hàng nhanh' },
                { icon: 'fa-headset', text: 'Hỗ trợ 24/7' },
              ].map(p => (
                <div key={p.icon} className="pd-pledge-item">
                  <i className={`fas ${p.icon}`} />
                  {p.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
