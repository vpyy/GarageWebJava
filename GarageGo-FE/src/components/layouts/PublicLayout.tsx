import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { to: '/customer/home', icon: 'fa-home', label: 'Trang chủ' },
  { to: '/customer/services', icon: 'fa-tools', label: 'Dịch vụ' },
  { to: '/customer/products', icon: 'fa-box', label: 'Sản phẩm' },
  { to: '/customer/contact', icon: 'fa-envelope', label: 'Liên hệ' },
];

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { itemCount } = useSelector((state: RootState) => state.cart);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Đăng xuất thành công!');
    navigate('/auth/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", margin: 0, padding: 0, background: '#f8fafc' }}>
      <style>{`
        * { box-sizing: border-box; }

        /* ── Navbar ── */
        .pl-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          transition: all 0.3s ease;
        }
        .pl-nav.scrolled {
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          border-bottom: 1px solid rgba(226,232,240,0.8);
        }
        .pl-nav.top {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid #e2e8f0;
        }
        .pl-nav-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 1.5rem;
          height: 68px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .pl-brand {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; color: #0f172a;
          font-size: 1.35rem; font-weight: 800; letter-spacing: -0.5px;
        }
        .pl-brand-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 16px;
          box-shadow: 0 4px 12px rgba(14,165,233,0.3);
        }
        .pl-nav-links {
          display: flex; align-items: center; gap: 4px;
          list-style: none; margin: 0; padding: 0;
        }
        .pl-nav-link {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 10px;
          text-decoration: none; font-size: 14px; font-weight: 500;
          color: #64748b; transition: all 0.2s;
        }
        .pl-nav-link:hover { color: #0ea5e9; background: rgba(14,165,233,0.08); }
        .pl-nav-link.active {
          color: #0ea5e9; background: rgba(14,165,233,0.1);
          font-weight: 600;
        }
        .pl-actions { display: flex; align-items: center; gap: 8px; }

        /* Cart btn */
        .pl-cart-btn {
          position: relative; width: 40px; height: 40px;
          border-radius: 10px; border: 1.5px solid #e2e8f0;
          background: white; color: #64748b; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; text-decoration: none;
          transition: all 0.2s;
        }
        .pl-cart-btn:hover { border-color: #0ea5e9; color: #0ea5e9; background: rgba(14,165,233,0.05); }
        .pl-cart-badge {
          position: absolute; top: -6px; right: -6px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white; border-radius: 50%;
          width: 18px; height: 18px; font-size: 10px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid white;
        }

        /* User menu */
        .pl-user-wrap { position: relative; }
        .pl-user-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 12px 6px 6px;
          border-radius: 12px; border: 1.5px solid #e2e8f0;
          background: white; cursor: pointer;
          transition: all 0.2s;
        }
        .pl-user-btn:hover { border-color: #0ea5e9; background: rgba(14,165,233,0.03); }
        .pl-avatar {
          width: 32px; height: 32px; border-radius: 8px;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          color: white; font-weight: 700; font-size: 13px;
          display: flex; align-items: center; justify-content: center;
        }
        .pl-username { font-size: 13px; font-weight: 600; color: #1e293b; }
        .pl-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: white; border-radius: 14px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
          border: 1px solid #f1f5f9;
          min-width: 220px; overflow: hidden;
          animation: dropIn 0.15s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pl-dropdown-header {
          padding: 14px 16px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border-bottom: 1px solid #e0f2fe;
        }
        .pl-dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px; color: #374151; text-decoration: none;
          font-size: 13px; font-weight: 500; transition: background 0.15s;
          cursor: pointer; border: none; background: none; width: 100%; text-align: left;
        }
        .pl-dropdown-item:hover { background: #f8fafc; }
        .pl-dropdown-item.danger { color: #ef4444; }
        .pl-dropdown-item.danger:hover { background: #fef2f2; }
        .pl-dropdown-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }

        /* Login btn */
        .pl-login-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 10px;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          color: white; text-decoration: none;
          font-size: 13px; font-weight: 600;
          box-shadow: 0 4px 12px rgba(14,165,233,0.3);
          transition: all 0.2s;
        }
        .pl-login-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        /* Mobile */
        .pl-hamburger {
          display: none; width: 40px; height: 40px;
          border-radius: 10px; border: 1.5px solid #e2e8f0;
          background: white; cursor: pointer;
          align-items: center; justify-content: center;
          font-size: 16px; color: #64748b;
        }
        .pl-mobile-menu {
          display: none; position: fixed;
          top: 68px; left: 0; right: 0; bottom: 0;
          background: rgba(15,23,42,0.5); z-index: 999;
          backdrop-filter: blur(4px);
        }
        .pl-mobile-panel {
          background: white; padding: 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        .pl-mobile-link {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 16px; border-radius: 10px;
          text-decoration: none; font-size: 15px; font-weight: 500;
          color: #374151; margin-bottom: 4px; transition: all 0.15s;
        }
        .pl-mobile-link:hover, .pl-mobile-link.active {
          background: rgba(14,165,233,0.08); color: #0ea5e9;
        }

        @media (max-width: 768px) {
          .pl-hamburger { display: flex !important; }
          .pl-nav-links, .pl-desktop-actions { display: none !important; }
          .pl-mobile-menu.open { display: block; }
          .pl-username { display: none; }
        }

        /* ── Footer ── */
        .pl-footer {
          background: #0f172a; color: white;
          padding: 4rem 0 0;
          margin-top: 0;
        }
        .pl-footer-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;
        }
        .pl-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 3rem; margin-bottom: 3rem;
        }
        .pl-footer-brand { font-size: 1.3rem; font-weight: 800; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
        .pl-footer-desc { color: #94a3b8; font-size: 14px; line-height: 1.7; margin-bottom: 20px; }
        .pl-footer-socials { display: flex; gap: 10px; }
        .pl-social-btn {
          width: 36px; height: 36px; border-radius: 8px;
          background: rgba(255,255,255,0.08); color: #94a3b8;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; font-size: 15px; transition: all 0.2s;
        }
        .pl-social-btn:hover { background: #0ea5e9; color: white; }
        .pl-footer-title { font-size: 13px; font-weight: 700; color: #e2e8f0; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 16px; }
        .pl-footer-link {
          display: flex; align-items: center; gap: 6px;
          color: #94a3b8; text-decoration: none; font-size: 14px;
          margin-bottom: 10px; transition: color 0.2s;
        }
        .pl-footer-link:hover { color: #0ea5e9; }
        .pl-footer-contact { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
        .pl-footer-contact-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(14,165,233,0.15); color: #0ea5e9;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; flex-shrink: 0; margin-top: 1px;
        }
        .pl-footer-contact-text { font-size: 13px; color: #94a3b8; line-height: 1.5; }
        .pl-footer-contact-label { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
        .pl-footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 1.5rem 0;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 13px; color: #64748b;
        }
        .pl-footer-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 20px;
          background: rgba(14,165,233,0.1); color: #0ea5e9;
          font-size: 12px; font-weight: 600;
        }

        @media (max-width: 900px) {
          .pl-footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
        @media (max-width: 600px) {
          .pl-footer-grid { grid-template-columns: 1fr; }
          .pl-footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
        }

        /* ── Main ── */
        .pl-main { margin-top: 68px; min-height: calc(100vh - 68px); }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`pl-nav ${scrolled ? 'scrolled' : 'top'}`}>
        <div className="pl-nav-inner">
          {/* Brand */}
          <Link to="/customer/home" className="pl-brand">
            <div className="pl-brand-icon">
              <i className="fas fa-car-side" />
            </div>
            MTProAuto
          </Link>

          {/* Desktop nav */}
          <ul className="pl-nav-links">
            {NAV_LINKS.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`pl-nav-link ${isActive(link.to) ? 'active' : ''}`}
                >
                  <i className={`fas ${link.icon}`} style={{ fontSize: '13px' }} />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="pl-actions pl-desktop-actions">
            {/* Cart */}
            <Link to="/customer/cart" className="pl-cart-btn">
              <i className="fas fa-shopping-cart" />
              {itemCount > 0 && <span className="pl-cart-badge">{itemCount > 9 ? '9+' : itemCount}</span>}
            </Link>

            {/* User */}
            {isAuthenticated && user ? (
              <div className="pl-user-wrap">
                <button className="pl-user-btn" onClick={() => setUserMenuOpen(v => !v)}>
                  <div className="pl-avatar">{user.username?.charAt(0).toUpperCase()}</div>
                  <span className="pl-username">{user.username}</span>
                  <i className="fas fa-chevron-down" style={{ fontSize: '10px', color: '#94a3b8' }} />
                </button>
                {userMenuOpen && (
                  <div className="pl-dropdown">
                    <div className="pl-dropdown-header">
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{user.username}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{user.email || 'Khách hàng'}</div>
                    </div>
                    <div style={{ padding: '6px 0' }}>
                      <Link to="/customer/profile" className="pl-dropdown-item">
                        <i className="fas fa-user-circle" style={{ color: '#0ea5e9', width: '16px' }} />
                        Thông tin tài khoản
                      </Link>
                      <Link to="/customer/orders" className="pl-dropdown-item">
                        <i className="fas fa-shopping-bag" style={{ color: '#8b5cf6', width: '16px' }} />
                        Lịch sử đơn hàng
                      </Link>
                      <Link to="/customer/service-requests" className="pl-dropdown-item">
                        <i className="fas fa-clipboard-list" style={{ color: '#f59e0b', width: '16px' }} />
                        Lịch sử dịch vụ
                      </Link>
                      <div className="pl-dropdown-divider" />
                      <button className="pl-dropdown-item danger" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt" style={{ width: '16px' }} />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth/login" className="pl-login-btn">
                <i className="fas fa-sign-in-alt" />
                Đăng nhập
              </Link>
            )}
          </div>

          {/* Hamburger */}
          <button className="pl-hamburger" onClick={() => setMobileOpen(v => !v)}>
            <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`pl-mobile-menu ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)}>
        <div className="pl-mobile-panel" onClick={e => e.stopPropagation()}>
          {NAV_LINKS.map(link => (
            <Link key={link.to} to={link.to} className={`pl-mobile-link ${isActive(link.to) ? 'active' : ''}`}>
              <i className={`fas ${link.icon}`} style={{ width: '18px', color: '#0ea5e9' }} />
              {link.label}
            </Link>
          ))}
          <div style={{ height: '1px', background: '#f1f5f9', margin: '8px 0' }} />
          <Link to="/customer/cart" className="pl-mobile-link">
            <i className="fas fa-shopping-cart" style={{ width: '18px', color: '#0ea5e9' }} />
            Giỏ hàng {itemCount > 0 && <span style={{ background: '#ef4444', color: 'white', borderRadius: '10px', padding: '1px 7px', fontSize: '11px', fontWeight: 700 }}>{itemCount}</span>}
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/customer/profile" className="pl-mobile-link">
                <i className="fas fa-user" style={{ width: '18px', color: '#0ea5e9' }} />
                Tài khoản
              </Link>
              <button className="pl-mobile-link" style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', width: '100%', textAlign: 'left' }} onClick={handleLogout}>
                <i className="fas fa-sign-out-alt" style={{ width: '18px' }} />
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/auth/login" className="pl-mobile-link" style={{ color: '#0ea5e9', fontWeight: 600 }}>
              <i className="fas fa-sign-in-alt" style={{ width: '18px' }} />
              Đăng nhập
            </Link>
          )}
        </div>
      </div>

      {/* ── MAIN ── */}
      <main className="pl-main">
        <Outlet />
      </main>

      {/* ── FOOTER ── */}
      <footer className="pl-footer">
        <div className="pl-footer-inner">
          <div className="pl-footer-grid">
            {/* Brand */}
            <div>
              <div className="pl-footer-brand">
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-car-side" style={{ color: 'white', fontSize: '16px' }} />
                </div>
                MTProAuto
              </div>
              <p className="pl-footer-desc">
                Hệ thống quản lý gara ô tô chuyên nghiệp, cung cấp dịch vụ sửa chữa và bảo dưỡng xe hơi chất lượng cao tại Quảng Ngãi.
              </p>
              <div className="pl-footer-socials">
                {['fa-facebook-f', 'fa-youtube', 'fa-tiktok', 'fa-instagram'].map(icon => (
                  <a key={icon} href="#" className="pl-social-btn">
                    <i className={`fab ${icon}`} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <div className="pl-footer-title">Điều hướng</div>
              {NAV_LINKS.map(link => (
                <Link key={link.to} to={link.to} className="pl-footer-link">
                  <i className={`fas ${link.icon}`} style={{ fontSize: '12px', width: '14px' }} />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Account */}
            <div>
              <div className="pl-footer-title">Tài khoản</div>
              {[
                { to: '/customer/profile', icon: 'fa-user', label: 'Hồ sơ' },
                { to: '/customer/orders', icon: 'fa-shopping-bag', label: 'Đơn hàng' },
                { to: '/customer/service-requests', icon: 'fa-clipboard-list', label: 'Dịch vụ' },
                { to: '/customer/cart', icon: 'fa-shopping-cart', label: 'Giỏ hàng' },
              ].map(item => (
                <Link key={item.to} to={item.to} className="pl-footer-link">
                  <i className={`fas ${item.icon}`} style={{ fontSize: '12px', width: '14px' }} />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Contact */}
            <div>
              <div className="pl-footer-title">Liên hệ</div>
              {[
                { icon: 'fa-phone-alt', label: 'Hotline', value: '038 442 4567' },
                { icon: 'fa-envelope', label: 'Email', value: 'contact@garagego.vn' },
                { icon: 'fa-map-marker-alt', label: 'Địa chỉ', value: 'Ngã 4 An Dương Vương, Quảng Ngãi' },
                { icon: 'fa-clock', label: 'Giờ làm việc', value: 'T2–T7: 7:30 – 17:30' },
              ].map(item => (
                <div key={item.icon} className="pl-footer-contact">
                  <div className="pl-footer-contact-icon">
                    <i className={`fas ${item.icon}`} />
                  </div>
                  <div>
                    <div className="pl-footer-contact-label">{item.label}</div>
                    <div className="pl-footer-contact-text">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pl-footer-bottom">
            <span>© 2025 MTProAuto. Tất cả quyền được bảo lưu.</span>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span className="pl-footer-badge">
                <i className="fas fa-shield-alt" />
                Bảo mật SSL
              </span>
              <span className="pl-footer-badge">
                <i className="fas fa-award" />
                ISO 9001:2015
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
