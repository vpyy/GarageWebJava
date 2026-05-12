import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { RootState } from '../../store';
import toast from 'react-hot-toast';

interface Service {
  maDV?: number;
  id?: number;
  tenDV?: string;
  donGia?: number;
  moTa: string;
  hinhAnh: string;
  trangThai: boolean;
}

interface Product {
  maSP: number;
  tenSP: string;
  donGia: number;
  moTa: string;
  hinhAnh: string;
  soLuongTon: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    n
  );

const HERO_SLIDES = [
  {
    bg: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80',
    badge: 'PREMIUM AUTO SERVICE',
    title: 'Chăm sóc xe hơi',
    highlight: 'chuyên nghiệp',
    desc: 'Đội ngũ kỹ thuật viên được chứng nhận, trang thiết bị hiện đại. Cam kết chất lượng — hài lòng 100% hoặc hoàn tiền.',
    cta1: {
      text: 'Đặt lịch ngay',
      icon: 'fa-calendar-check',
      to: '/customer/services',
    },
    cta2: { text: 'Xem dịch vụ', icon: 'fa-tools', to: '/customer/services' },
  },
  {
    bg: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&q=80',
    badge: 'PHỤ TÙNG CHÍNH HÃNG',
    title: 'Hơn 500+ sản phẩm',
    highlight: 'giá tốt nhất',
    desc: 'Phụ tùng ô tô chính hãng từ các thương hiệu uy tín. Bảo hành đầy đủ, giao hàng nhanh toàn quốc.',
    cta1: {
      text: 'Mua sắm ngay',
      icon: 'fa-shopping-bag',
      to: '/customer/products',
    },
    cta2: { text: 'Xem sản phẩm', icon: 'fa-box', to: '/customer/products' },
  },
  {
    bg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
    badge: 'ĐẶT LỊCH TRỰC TUYẾN',
    title: 'Tiện lợi, nhanh chóng',
    highlight: 'mọi lúc mọi nơi',
    desc: 'Đặt lịch dịch vụ trực tuyến 24/7. Nhận xác nhận ngay lập tức. Không cần chờ đợi, không mất thời gian.',
    cta1: {
      text: 'Đặt lịch ngay',
      icon: 'fa-calendar-check',
      to: '/customer/services',
    },
    cta2: {
      text: 'Liên hệ tư vấn',
      icon: 'fa-headset',
      to: '/customer/contact',
    },
  },
  {
    bg: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80',
    badge: 'ƯU ĐÃI ĐẶC BIỆT',
    title: 'Khách hàng mới',
    highlight: 'giảm 10% dịch vụ',
    desc: 'Đăng ký tài khoản ngay hôm nay để nhận ưu đãi đặc biệt dành cho khách hàng mới. Số lượng có hạn!',
    cta1: { text: 'Đăng ký ngay', icon: 'fa-user-plus', to: '/auth/register' },
    cta2: {
      text: 'Tìm hiểu thêm',
      icon: 'fa-info-circle',
      to: '/customer/contact',
    },
  },
];

const STATS = [
  { icon: 'fa-users', value: '2,500+', label: 'Khách hàng tin tưởng' },
  { icon: 'fa-car', value: '8,000+', label: 'Xe đã phục vụ' },
  { icon: 'fa-tools', value: '15+', label: 'Dịch vụ chuyên nghiệp' },
  { icon: 'fa-star', value: '4.9/5', label: 'Đánh giá trung bình' },
];

const WHY_US = [
  {
    icon: 'fa-certificate',
    color: '#0ea5e9',
    title: 'Kỹ thuật viên được chứng nhận',
    desc: 'Đội ngũ được đào tạo bài bản, có chứng chỉ chuyên môn quốc tế.',
  },
  {
    icon: 'fa-clock',
    color: '#8b5cf6',
    title: 'Dịch vụ nhanh chóng',
    desc: 'Cam kết hoàn thành đúng hẹn, không để khách hàng chờ đợi lâu.',
  },
  {
    icon: 'fa-shield-alt',
    color: '#22c55e',
    title: 'Bảo hành chính sách rõ ràng',
    desc: 'Bảo hành dịch vụ và phụ tùng, đảm bảo quyền lợi khách hàng.',
  },
  {
    icon: 'fa-tag',
    color: '#f59e0b',
    title: 'Giá cả minh bạch',
    desc: 'Báo giá trước khi thực hiện, không phát sinh chi phí ẩn.',
  },
];

export const CustomerHomePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    fetch('/api/dich-vu')
      .then(r => (r.ok ? r.json() : []))
      .then(setServices)
      .catch(() => {
        /* ignore */
      });
    fetch('/api/san-pham')
      .then(r => (r.ok ? r.json() : []))
      .then(setProducts)
      .catch(() => {
        /* ignore */
      });
    const t = setInterval(
      () => setSlide(s => (s + 1) % HERO_SLIDES.length),
      5000
    );
    return () => clearInterval(t);
  }, []);

  const handleAddToCart = (p: Product) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập');
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

  return (
    <div style={{ background: '#f8fafc' }}>
      <style>{`
        /* Hero */
        .hero { position: relative; height: 92vh; min-height: 600px; overflow: hidden; }
        .hero-slide { position: absolute; inset: 0; transition: opacity 0.8s ease; }
        .hero-slide img { width: 100%; height: 100%; object-fit: cover; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.5) 60%, transparent 100%); }
        .hero-content { position: absolute; inset: 0; display: flex; align-items: center; padding: 0 2rem; }
        .hero-inner { max-width: 680px; margin-left: calc((100vw - 1200px) / 2); padding-left: 1.5rem; }
        .hero-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; background: rgba(14,165,233,0.2); border: 1px solid rgba(14,165,233,0.4); color: #7dd3fc; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; margin-bottom: 20px; }
        .hero-title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; color: white; line-height: 1.1; margin-bottom: 16px; }
        .hero-highlight { background: linear-gradient(135deg, #0ea5e9, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-desc { font-size: 1.1rem; color: rgba(255,255,255,0.8); line-height: 1.7; margin-bottom: 32px; max-width: 520px; }
        .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
        .hero-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 12px; background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 8px 24px rgba(14,165,233,0.4); transition: all 0.2s; }
        .hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(14,165,233,0.5); }
        .hero-btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 12px; background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.3); color: white; text-decoration: none; font-weight: 600; font-size: 15px; backdrop-filter: blur(8px); transition: all 0.2s; }
        .hero-btn-secondary:hover { background: rgba(255,255,255,0.2); }
        .hero-dots { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; }
        .hero-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4); cursor: pointer; transition: all 0.3s; }
        .hero-dot.active { width: 24px; border-radius: 4px; background: #0ea5e9; }

        /* Stats bar */
        .stats-bar { background: white; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
        .stats-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; display: grid; grid-template-columns: repeat(4, 1fr); }
        .stat-item { padding: 28px 20px; text-align: center; border-right: 1px solid #f1f5f9; }
        .stat-item:last-child { border-right: none; }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #eff6ff, #dbeafe); color: #0ea5e9; display: flex; align-items: center; justify-content: center; font-size: 20px; margin: 0 auto 10px; }
        .stat-value { font-size: 1.8rem; font-weight: 900; color: #0f172a; line-height: 1; margin-bottom: 4px; }
        .stat-label { font-size: 13px; color: #64748b; font-weight: 500; }

        /* Section */
        .section { padding: 5rem 0; }
        .section-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .section-header { text-align: center; margin-bottom: 3rem; }
        .section-tag { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; background: rgba(14,165,233,0.08); color: #0ea5e9; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; }
        .section-title { font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 900; color: #0f172a; margin-bottom: 12px; }
        .section-desc { font-size: 1rem; color: #64748b; max-width: 560px; margin: 0 auto; line-height: 1.7; }

        /* Service cards */
        .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .service-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; transition: all 0.3s; cursor: pointer; }
        .service-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); border-color: #bae6fd; }
        .service-card-img { position: relative; height: 180px; overflow: hidden; }
        .service-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
        .service-card:hover .service-card-img img { transform: scale(1.08); }
        .service-card-badge { position: absolute; top: 12px; right: 12px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .service-card-body { padding: 18px; }
        .service-card-name { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
        .service-card-desc { font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .service-card-footer { display: flex; justify-content: space-between; align-items: center; }
        .service-price { font-size: 17px; font-weight: 800; color: #0ea5e9; }
        .service-book-btn { padding: 7px 16px; border-radius: 8px; background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; border: none; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .service-book-btn:hover { opacity: 0.9; transform: scale(1.03); }

        /* Product cards */
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
        .product-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; transition: all 0.3s; }
        .product-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
        .product-card-img { position: relative; height: 200px; overflow: hidden; }
        .product-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
        .product-card:hover .product-card-img img { transform: scale(1.08); }
        .product-card-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; gap: 10px; opacity: 0; transition: opacity 0.3s; }
        .product-card:hover .product-card-overlay { opacity: 1; }
        .overlay-btn { width: 40px; height: 40px; border-radius: 50%; background: white; border: none; color: #1e293b; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 15px; transition: all 0.2s; }
        .overlay-btn:hover { background: #0ea5e9; color: white; }
        .product-card-body { padding: 14px; }
        .product-card-name { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .product-card-desc { font-size: 12px; color: #94a3b8; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .product-card-footer { display: flex; justify-content: space-between; align-items: center; }
        .product-price { font-size: 16px; font-weight: 800; color: #0ea5e9; }
        .product-stock { font-size: 11px; font-weight: 600; }

        /* Why us */
        .why-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
        .why-card { background: white; border-radius: 16px; padding: 28px; border: 1px solid #f1f5f9; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: all 0.3s; }
        .why-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
        .why-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 16px; }
        .why-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
        .why-desc { font-size: 13px; color: #64748b; line-height: 1.7; }

        /* CTA */
        .cta-section { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%); padding: 5rem 0; position: relative; overflow: hidden; }
        .cta-section::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at 30% 50%, rgba(14,165,233,0.15) 0%, transparent 50%); }
        .cta-inner { max-width: 700px; margin: 0 auto; text-align: center; padding: 0 1.5rem; position: relative; }
        .cta-title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: white; margin-bottom: 16px; }
        .cta-desc { font-size: 1.05rem; color: rgba(255,255,255,0.75); margin-bottom: 32px; line-height: 1.7; }
        .cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        /* View all btn */
        .view-all-wrap { text-align: center; margin-top: 2.5rem; }
        .view-all-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border-radius: 12px; border: 2px solid #e2e8f0; background: white; color: #374151; font-weight: 600; font-size: 14px; text-decoration: none; transition: all 0.2s; }
        .view-all-btn:hover { border-color: #0ea5e9; color: #0ea5e9; background: rgba(14,165,233,0.04); }

        @media (max-width: 768px) {
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .stat-item { border-right: none; border-bottom: 1px solid #f1f5f9; }
          .hero-inner { margin-left: 0; }
        }
        @media (max-width: 480px) {
          .stats-inner { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="hero">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={i}
            className="hero-slide"
            style={{ opacity: slide === i ? 1 : 0 }}
          >
            <img src={s.bg} alt="" />
            <div className="hero-overlay" />
          </div>
        ))}
        <div className="hero-content">
          <div className="hero-inner">
            <div className="hero-badge">
              <i className="fas fa-star" style={{ fontSize: '10px' }} />
              {HERO_SLIDES[slide].badge}
            </div>
            <h1 className="hero-title">
              {HERO_SLIDES[slide].title}
              <br />
              <span className="hero-highlight">
                {HERO_SLIDES[slide].highlight}
              </span>
            </h1>
            <p className="hero-desc">{HERO_SLIDES[slide].desc}</p>
            <div className="hero-btns">
              <Link
                to={HERO_SLIDES[slide].cta1.to}
                className="hero-btn-primary"
              >
                <i className={`fas ${HERO_SLIDES[slide].cta1.icon}`} />
                {HERO_SLIDES[slide].cta1.text}
              </Link>
              <Link
                to={HERO_SLIDES[slide].cta2.to}
                className="hero-btn-secondary"
              >
                <i className={`fas ${HERO_SLIDES[slide].cta2.icon}`} />
                {HERO_SLIDES[slide].cta2.text}
              </Link>
            </div>
          </div>
        </div>
        {/* Slide counter */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            right: '2rem',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          {String(slide + 1).padStart(2, '0')} /{' '}
          {String(HERO_SLIDES.length).padStart(2, '0')}
        </div>
        <div className="hero-dots">
          {HERO_SLIDES.map((_, i) => (
            <div
              key={i}
              className={`hero-dot ${slide === i ? 'active' : ''}`}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="stats-bar">
        <div className="stats-inner">
          {STATS.map(s => (
            <div key={s.label} className="stat-item">
              <div className="stat-icon">
                <i className={`fas ${s.icon}`} />
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">
              <i className="fas fa-tools" />
              Dịch vụ
            </div>
            <h2 className="section-title">Dịch vụ nổi bật</h2>
            <p className="section-desc">
              Chúng tôi cung cấp đầy đủ các dịch vụ bảo dưỡng và sửa chữa ô tô
              chuyên nghiệp.
            </p>
          </div>
          <div className="services-grid">
            {services.slice(0, 6).map(s => {
              const id = s.maDV || s.id;
              const name = s.tenDV || '';
              const price = s.donGia || 0;
              return (
                <div
                  key={id}
                  className="service-card"
                  onClick={() => navigate(`/customer/services/${id}/book`)}
                >
                  <div className="service-card-img">
                    <img
                      src={
                        s.hinhAnh ||
                        'https://images.pexels.com/photos/4489743/pexels-photo-4489743.jpeg'
                      }
                      alt={name}
                    />
                    <span
                      className="service-card-badge"
                      style={{
                        background: s.trangThai ? '#dcfce7' : '#f1f5f9',
                        color: s.trangThai ? '#15803d' : '#64748b',
                      }}
                    >
                      {s.trangThai ? '✓ Có sẵn' : 'Tạm ngưng'}
                    </span>
                  </div>
                  <div className="service-card-body">
                    <div className="service-card-name">{name}</div>
                    <div className="service-card-desc">{s.moTa}</div>
                    <div className="service-card-footer">
                      <span className="service-price">{fmt(price)}</span>
                      <button
                        className="service-book-btn"
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/customer/services/${id}/book`);
                        }}
                      >
                        Đặt lịch
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="view-all-wrap">
            <Link to="/customer/services" className="view-all-btn">
              Xem tất cả dịch vụ <i className="fas fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="section" style={{ background: 'white' }}>
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">
              <i className="fas fa-award" />
              Tại sao chọn chúng tôi
            </div>
            <h2 className="section-title">Cam kết chất lượng</h2>
            <p className="section-desc">
              Chúng tôi không chỉ sửa xe — chúng tôi xây dựng niềm tin với từng
              khách hàng.
            </p>
          </div>
          <div className="why-grid">
            {WHY_US.map(w => (
              <div key={w.title} className="why-card">
                <div
                  className="why-icon"
                  style={{ background: `${w.color}15`, color: w.color }}
                >
                  <i className={`fas ${w.icon}`} />
                </div>
                <div className="why-title">{w.title}</div>
                <div className="why-desc">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">
              <i className="fas fa-box" />
              Sản phẩm
            </div>
            <h2 className="section-title">Phụ tùng chính hãng</h2>
            <p className="section-desc">
              Hơn 500+ sản phẩm phụ tùng ô tô chính hãng với giá cả cạnh tranh.
            </p>
          </div>
          <div className="products-grid">
            {products.slice(0, 8).map(p => (
              <div key={p.maSP} className="product-card">
                <div className="product-card-img">
                  <img
                    src={
                      p.hinhAnh ||
                      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'
                    }
                    alt={p.tenSP}
                  />
                  <div className="product-card-overlay">
                    <button
                      className="overlay-btn"
                      onClick={() => handleAddToCart(p)}
                      title="Thêm vào giỏ"
                    >
                      <i className="fas fa-cart-plus" />
                    </button>
                    <button
                      className="overlay-btn"
                      onClick={() => navigate(`/customer/products/${p.maSP}`)}
                      title="Xem chi tiết"
                    >
                      <i className="fas fa-eye" />
                    </button>
                  </div>
                  {p.soLuongTon <= 5 && p.soLuongTon > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: '#f59e0b',
                        color: 'white',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      Còn {p.soLuongTon}
                    </span>
                  )}
                </div>
                <div className="product-card-body">
                  <div className="product-card-name">{p.tenSP}</div>
                  <div className="product-card-desc">{p.moTa}</div>
                  <div className="product-card-footer">
                    <span className="product-price">{fmt(p.donGia)}</span>
                    <span
                      className="product-stock"
                      style={{
                        color: p.soLuongTon > 0 ? '#22c55e' : '#ef4444',
                      }}
                    >
                      {p.soLuongTon > 0 ? `Còn ${p.soLuongTon}` : 'Hết hàng'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="view-all-wrap">
            <Link to="/customer/products" className="view-all-btn">
              Xem tất cả sản phẩm <i className="fas fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <div
            className="section-tag"
            style={{
              background: 'rgba(14,165,233,0.15)',
              color: '#7dd3fc',
              marginBottom: '20px',
            }}
          >
            <i className="fas fa-phone-alt" />
            Liên hệ ngay
          </div>
          <h2 className="cta-title">Xe của bạn cần được chăm sóc?</h2>
          <p className="cta-desc">
            Đặt lịch ngay hôm nay để nhận ưu đãi đặc biệt. Đội ngũ kỹ thuật viên
            của chúng tôi luôn sẵn sàng phục vụ bạn.
          </p>
          <div className="cta-btns">
            <Link to="/customer/services" className="hero-btn-primary">
              <i className="fas fa-calendar-check" />
              Đặt lịch dịch vụ
            </Link>
            <Link to="/customer/contact" className="hero-btn-secondary">
              <i className="fas fa-headset" />
              Tư vấn miễn phí
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
