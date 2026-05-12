import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Service {
  maDV?: number;
  id?: number;
  tenDV?: string;
  donGia?: number;
  moTa: string;
  hinhAnh: string;
  trangThai: boolean;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    n
  );

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 9;

  useEffect(() => {
    fetch('/api/dich-vu')
      .then(r => (r.ok ? r.json() : []))
      .then(setServices)
      .catch(() => {
        /* ignore */
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = services.filter(
    s =>
      (s.tenDV || '').toLowerCase().includes(search.toLowerCase()) ||
      s.moTa.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        .sv-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f172a 100%);
          padding: 5rem 0 4rem; text-align: center; position: relative; overflow: hidden;
        }
        .sv-hero::before {
          content: ''; position: absolute; inset: 0;
          background: url('https://images.pexels.com/photos/4489743/pexels-photo-4489743.jpeg') center/cover;
          opacity: 0.12;
        }
        .sv-hero-inner { position: relative; max-width: 700px; margin: 0 auto; padding: 0 1.5rem; }
        .sv-tag { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; background: rgba(14,165,233,0.15); border: 1px solid rgba(14,165,233,0.3); color: #7dd3fc; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; margin-bottom: 16px; }
        .sv-hero h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: white; margin-bottom: 12px; }
        .sv-hero p { color: rgba(255,255,255,0.7); font-size: 1.05rem; line-height: 1.7; margin-bottom: 28px; }
        .sv-search-wrap { position: relative; max-width: 480px; margin: 0 auto; }
        .sv-search { width: 100%; padding: 14px 20px 14px 48px; border-radius: 14px; border: none; font-size: 15px; outline: none; box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
        .sv-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 16px; }

        .sv-body { max-width: 1200px; margin: 0 auto; padding: 3rem 1.5rem; }
        .sv-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .sv-count { font-size: 14px; color: #64748b; }
        .sv-count strong { color: #0f172a; }

        .sv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }

        .sv-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; transition: all 0.3s; display: flex; flex-direction: column; }
        .sv-card:hover { transform: translateY(-8px); box-shadow: 0 20px 48px rgba(0,0,0,0.12); border-color: #bae6fd; }
        .sv-card-img { position: relative; height: 200px; overflow: hidden; }
        .sv-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
        .sv-card:hover .sv-card-img img { transform: scale(1.08); }
        .sv-card-status { position: absolute; top: 14px; left: 14px; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; backdrop-filter: blur(8px); }
        .sv-card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
        .sv-card-name { font-size: 17px; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
        .sv-card-desc { font-size: 13px; color: #64748b; line-height: 1.7; flex: 1; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .sv-card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid #f1f5f9; }
        .sv-price { font-size: 20px; font-weight: 900; color: #0ea5e9; }
        .sv-price-label { font-size: 11px; color: #94a3b8; font-weight: 400; }
        .sv-book-btn { display: flex; align-items: center; gap: 6px; padding: 10px 20px; border-radius: 10px; background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; border: none; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(14,165,233,0.3); }
        .sv-book-btn:hover { transform: scale(1.04); box-shadow: 0 6px 20px rgba(14,165,233,0.4); }
        .sv-book-btn:disabled { background: #e2e8f0; color: #94a3b8; box-shadow: none; cursor: not-allowed; transform: none; }

        .sv-pagination { display: flex; justify-content: center; gap: 6px; margin-top: 3rem; }
        .sv-page-btn { width: 40px; height: 40px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: white; color: #374151; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .sv-page-btn:hover { border-color: #0ea5e9; color: #0ea5e9; }
        .sv-page-btn.active { background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(14,165,233,0.3); }
        .sv-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .sv-empty { text-align: center; padding: 5rem 2rem; }
        .sv-empty-icon { font-size: 4rem; color: #cbd5e1; margin-bottom: 1rem; }

        .sv-skeleton { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 20px; height: 340px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>

      {/* Hero */}
      <div className="sv-hero">
        <div className="sv-hero-inner">
          <div className="sv-tag">
            <i className="fas fa-tools" />
            Dịch vụ chuyên nghiệp
          </div>
          <h1>Dịch vụ bảo dưỡng & sửa chữa</h1>
          <p>
            Đội ngũ kỹ thuật viên được chứng nhận, trang thiết bị hiện đại, cam
            kết chất lượng hàng đầu.
          </p>
          <div className="sv-search-wrap">
            <i className="fas fa-search sv-search-icon" />
            <input
              className="sv-search"
              placeholder="Tìm kiếm dịch vụ..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="sv-body">
        <div className="sv-meta">
          <span className="sv-count">
            {search ? (
              <>
                Tìm thấy <strong>{filtered.length}</strong> dịch vụ cho "
                <strong>{search}</strong>"
              </>
            ) : (
              <>
                <strong>{filtered.length}</strong> dịch vụ có sẵn
              </>
            )}
          </span>
        </div>

        {loading ? (
          <div className="sv-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="sv-skeleton" />
            ))}
          </div>
        ) : paged.length > 0 ? (
          <div className="sv-grid">
            {paged.map(s => {
              const id = s.maDV || s.id;
              const name = s.tenDV || '';
              const price = s.donGia || 0;
              return (
                <div key={id} className="sv-card">
                  <div className="sv-card-img">
                    <img
                      src={
                        s.hinhAnh ||
                        'https://images.pexels.com/photos/4489743/pexels-photo-4489743.jpeg'
                      }
                      alt={name}
                    />
                    <span
                      className="sv-card-status"
                      style={{
                        background: s.trangThai
                          ? 'rgba(34,197,94,0.9)'
                          : 'rgba(148,163,184,0.9)',
                        color: 'white',
                      }}
                    >
                      {s.trangThai ? '✓ Đang hoạt động' : 'Tạm ngưng'}
                    </span>
                  </div>
                  <div className="sv-card-body">
                    <div className="sv-card-name">{name}</div>
                    <div className="sv-card-desc">{s.moTa}</div>
                    <div className="sv-card-footer">
                      <div>
                        <div className="sv-price">{fmt(price)}</div>
                        <div className="sv-price-label">Giá tham khảo</div>
                      </div>
                      <button
                        className="sv-book-btn"
                        disabled={!s.trangThai}
                        onClick={() =>
                          navigate(`/customer/services/${id}/book`)
                        }
                      >
                        <i className="fas fa-calendar-check" />
                        Đặt lịch
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="sv-empty">
            <div className="sv-empty-icon">
              <i className="fas fa-search" />
            </div>
            <h3 style={{ color: '#374151', fontWeight: 700 }}>
              Không tìm thấy dịch vụ
            </h3>
            <p style={{ color: '#64748b' }}>Thử tìm kiếm với từ khóa khác</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="sv-pagination">
            <button
              className="sv-page-btn"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <i className="fas fa-chevron-left" style={{ fontSize: '12px' }} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`sv-page-btn ${p === page ? 'active' : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="sv-page-btn"
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
