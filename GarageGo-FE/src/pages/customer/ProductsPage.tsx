import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearError } from '../../store/slices/cartSlice';
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

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { error } = useSelector((state: RootState) => state.cart);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('default');
  const PER_PAGE = 12;

  useEffect(() => {
    fetch('/api/san-pham')
      .then(r => (r.ok ? r.json() : []))
      .then(setProducts)
      .catch(() => {
        /* ignore */
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleAddToCart = (p: Product) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/auth/login');
      return;
    }
    dispatch(
      addToCart({
        id: p.maSP,
        name: p.tenSP,
        price: p.donGia,
        quantity: 1,
        image: p.hinhAnh,
        stock: p.soLuongTon,
        isAuthenticated,
      })
    );
    toast.success('Đã thêm vào giỏ hàng!');
  };

  let filtered = products.filter(
    p =>
      p.tenSP.toLowerCase().includes(search.toLowerCase()) ||
      p.moTa.toLowerCase().includes(search.toLowerCase())
  );
  if (sortBy === 'price-asc')
    filtered = [...filtered].sort((a, b) => a.donGia - b.donGia);
  if (sortBy === 'price-desc')
    filtered = [...filtered].sort((a, b) => b.donGia - a.donGia);
  if (sortBy === 'stock')
    filtered = [...filtered].sort((a, b) => b.soLuongTon - a.soLuongTon);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        .pp-hero { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); padding: 5rem 0 4rem; position: relative; overflow: hidden; }
        .pp-hero::before { content: ''; position: absolute; inset: 0; background: url('https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg') center/cover; opacity: 0.08; }
        .pp-hero-inner { position: relative; max-width: 700px; margin: 0 auto; text-align: center; padding: 0 1.5rem; }
        .pp-tag { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; background: rgba(14,165,233,0.15); border: 1px solid rgba(14,165,233,0.3); color: #7dd3fc; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; margin-bottom: 16px; }
        .pp-hero h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: white; margin-bottom: 12px; }
        .pp-hero p { color: rgba(255,255,255,0.7); font-size: 1.05rem; margin-bottom: 28px; }
        .pp-search-wrap { position: relative; max-width: 480px; margin: 0 auto; }
        .pp-search { width: 100%; padding: 14px 20px 14px 48px; border-radius: 14px; border: none; font-size: 15px; outline: none; box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
        .pp-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 16px; }

        .pp-body { max-width: 1200px; margin: 0 auto; padding: 2.5rem 1.5rem; }
        .pp-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 12px; }
        .pp-count { font-size: 14px; color: #64748b; }
        .pp-count strong { color: #0f172a; }
        .pp-sort { padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; background: white; font-size: 13px; font-weight: 600; color: #374151; outline: none; cursor: pointer; }

        .pp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }

        .pp-card { background: white; border-radius: 18px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; transition: all 0.3s; display: flex; flex-direction: column; }
        .pp-card:hover { transform: translateY(-8px); box-shadow: 0 20px 48px rgba(0,0,0,0.12); border-color: #bae6fd; }
        .pp-card-img { position: relative; height: 200px; overflow: hidden; }
        .pp-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
        .pp-card:hover .pp-card-img img { transform: scale(1.08); }
        .pp-card-overlay { position: absolute; inset: 0; background: rgba(15,23,42,0.65); display: flex; align-items: center; justify-content: center; gap: 10px; opacity: 0; transition: opacity 0.3s; }
        .pp-card:hover .pp-card-overlay { opacity: 1; }
        .pp-overlay-btn { width: 42px; height: 42px; border-radius: 50%; background: white; border: none; color: #1e293b; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 15px; transition: all 0.2s; }
        .pp-overlay-btn:hover { background: #0ea5e9; color: white; transform: scale(1.1); }
        .pp-overlay-btn:disabled { background: #94a3b8; color: white; cursor: not-allowed; transform: none; }
        .pp-badge { position: absolute; top: 12px; left: 12px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .pp-card-body { padding: 16px; flex: 1; display: flex; flex-direction: column; }
        .pp-card-name { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 5px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4; min-height: 2.8em; }
        .pp-card-desc { font-size: 12px; color: #94a3b8; line-height: 1.6; flex: 1; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .pp-card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #f1f5f9; }
        .pp-price { font-size: 17px; font-weight: 900; color: #0ea5e9; }
        .pp-stock { font-size: 11px; font-weight: 700; }

        .pp-pagination { display: flex; justify-content: center; gap: 6px; margin-top: 3rem; }
        .pp-page-btn { width: 40px; height: 40px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: white; color: #374151; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .pp-page-btn:hover { border-color: #0ea5e9; color: #0ea5e9; }
        .pp-page-btn.active { background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(14,165,233,0.3); }
        .pp-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .pp-skeleton { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 18px; height: 320px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* Stats */
        .pp-stats { background: white; border-bottom: 1px solid #f1f5f9; }
        .pp-stats-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; display: grid; grid-template-columns: repeat(4, 1fr); }
        .pp-stat { padding: 22px 16px; text-align: center; border-right: 1px solid #f1f5f9; }
        .pp-stat:last-child { border-right: none; }
        .pp-stat-val { font-size: 1.6rem; font-weight: 900; color: #0ea5e9; }
        .pp-stat-label { font-size: 12px; color: #64748b; margin-top: 2px; }
        @media (max-width: 600px) { .pp-stats-inner { grid-template-columns: repeat(2, 1fr); } .pp-stat { border-right: none; border-bottom: 1px solid #f1f5f9; } }
      `}</style>

      {/* Hero */}
      <div className="pp-hero">
        <div className="pp-hero-inner">
          <div className="pp-tag">
            <i className="fas fa-box" />
            Phụ tùng chính hãng
          </div>
          <h1>Sản phẩm ô tô</h1>
          <p>
            Hơn 500+ sản phẩm phụ tùng chính hãng, giá cả cạnh tranh, giao hàng
            nhanh.
          </p>
          <div className="pp-search-wrap">
            <i className="fas fa-search pp-search-icon" />
            <input
              className="pp-search"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="pp-stats">
        <div className="pp-stats-inner">
          {[
            { val: `${products.length}+`, label: 'Sản phẩm' },
            { val: '1000+', label: 'Khách hàng' },
            { val: '5+', label: 'Năm kinh nghiệm' },
            { val: '24/7', label: 'Hỗ trợ' },
          ].map(s => (
            <div key={s.label} className="pp-stat">
              <div className="pp-stat-val">{s.val}</div>
              <div className="pp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="pp-body">
        <div className="pp-toolbar">
          <span className="pp-count">
            {search ? (
              <>
                Tìm thấy <strong>{filtered.length}</strong> sản phẩm
              </>
            ) : (
              <>
                <strong>{filtered.length}</strong> sản phẩm
              </>
            )}
          </span>
          <select
            className="pp-sort"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="default">Mặc định</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="stock">Còn nhiều nhất</option>
          </select>
        </div>

        {loading ? (
          <div className="pp-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="pp-skeleton" />
            ))}
          </div>
        ) : paged.length > 0 ? (
          <div className="pp-grid">
            {paged.map(p => (
              <div key={p.maSP} className="pp-card">
                <div className="pp-card-img">
                  <img
                    src={
                      p.hinhAnh ||
                      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'
                    }
                    alt={p.tenSP}
                  />
                  <span
                    className="pp-badge"
                    style={{
                      background:
                        p.soLuongTon > 0
                          ? 'rgba(34,197,94,0.9)'
                          : 'rgba(239,68,68,0.9)',
                      color: 'white',
                    }}
                  >
                    {p.soLuongTon > 0 ? `Còn ${p.soLuongTon}` : 'Hết hàng'}
                  </span>
                  <div className="pp-card-overlay">
                    <button
                      className="pp-overlay-btn"
                      onClick={() => handleAddToCart(p)}
                      disabled={p.soLuongTon <= 0}
                      title="Thêm vào giỏ"
                    >
                      <i className="fas fa-cart-plus" />
                    </button>
                    <button
                      className="pp-overlay-btn"
                      onClick={() => navigate(`/customer/products/${p.maSP}`)}
                      title="Xem chi tiết"
                    >
                      <i className="fas fa-eye" />
                    </button>
                  </div>
                </div>
                <div className="pp-card-body">
                  <div className="pp-card-name">{p.tenSP}</div>
                  <div className="pp-card-desc">{p.moTa}</div>
                  <div className="pp-card-footer">
                    <span className="pp-price">{fmt(p.donGia)}</span>
                    <span
                      className="pp-stock"
                      style={{
                        color: p.soLuongTon > 0 ? '#22c55e' : '#ef4444',
                      }}
                    >
                      {p.soLuongTon > 0 ? (
                        <>
                          <i className="fas fa-check me-1" />
                          Còn hàng
                        </>
                      ) : (
                        <>
                          <i className="fas fa-times me-1" />
                          Hết hàng
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '5rem 2rem',
              background: 'white',
              borderRadius: '20px',
            }}
          >
            <i
              className="fas fa-search"
              style={{
                fontSize: '3.5rem',
                color: '#cbd5e1',
                display: 'block',
                marginBottom: '1rem',
              }}
            />
            <h3 style={{ color: '#374151', fontWeight: 700 }}>
              Không tìm thấy sản phẩm
            </h3>
            <p style={{ color: '#64748b' }}>Thử tìm kiếm với từ khóa khác</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pp-pagination">
            <button
              className="pp-page-btn"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <i className="fas fa-chevron-left" style={{ fontSize: '12px' }} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`pp-page-btn ${p === page ? 'active' : ''}`}
                onClick={() => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {p}
              </button>
            ))}
            <button
              className="pp-page-btn"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              <i
                className="fas fa-chevron-right"
                style={{ fontSize: '12px' }}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
