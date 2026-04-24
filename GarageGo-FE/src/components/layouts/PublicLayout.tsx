import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { itemCount } = useSelector((state: RootState) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Đăng xuất thành công!');
    navigate('/auth/login');
  };

  return (
    <div
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Header */}
      <header>
        <nav
          style={{
            background: '#ffffff',
            borderBottom: '1px solid #cbd5e1',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            padding: '1rem 0',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Brand */}
            <Link
              to="/customer/home"
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: '#0f172a',
                fontSize: '1.5rem',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={e => {
                e.currentTarget.style.color = '#0ea5e9';
              }}
              onMouseOut={e => {
                e.currentTarget.style.color = '#0f172a';
              }}
            >
              <i
                className="fas fa-car-side"
                style={{
                  color: '#0ea5e9',
                  marginRight: '0.5rem',
                }}
              ></i>
              MTProAuto
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                fontSize: '1.25rem',
                color: '#64748b',
                cursor: 'pointer',
              }}
              className="mobile-menu-btn"
            >
              <i className="fas fa-bars"></i>
            </button>

            {/* Desktop Navigation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
              }}
              className="desktop-nav"
            >
              {/* Main Navigation */}
              <ul
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  gap: '0.5rem',
                }}
              >
                <li>
                  <Link
                    to="/customer/home"
                    style={{
                      color: '#64748b',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      padding: '0.5rem 1rem',
                      margin: '0 0.25rem',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.color = '#0ea5e9';
                      e.currentTarget.style.background =
                        'rgba(14, 165, 233, 0.1)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.color = '#64748b';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <i
                      className="fas fa-home"
                      style={{ marginRight: '0.5rem' }}
                    ></i>
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/customer/services"
                    style={{
                      color: '#64748b',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      padding: '0.5rem 1rem',
                      margin: '0 0.25rem',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.color = '#0ea5e9';
                      e.currentTarget.style.background =
                        'rgba(14, 165, 233, 0.1)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.color = '#64748b';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <i
                      className="fas fa-tools"
                      style={{ marginRight: '0.5rem' }}
                    ></i>
                    Dịch vụ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/customer/products"
                    style={{
                      color: '#64748b',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      padding: '0.5rem 1rem',
                      margin: '0 0.25rem',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.color = '#0ea5e9';
                      e.currentTarget.style.background =
                        'rgba(14, 165, 233, 0.1)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.color = '#64748b';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <i
                      className="fas fa-box"
                      style={{ marginRight: '0.5rem' }}
                    ></i>
                    Sản phẩm
                  </Link>
                </li>
                <li>
                  <Link
                    to="/customer/contact"
                    style={{
                      color: '#64748b',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      padding: '0.5rem 1rem',
                      margin: '0 0.25rem',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.color = '#0ea5e9';
                      e.currentTarget.style.background =
                        'rgba(14, 165, 233, 0.1)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.color = '#64748b';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <i
                      className="fas fa-envelope"
                      style={{ marginRight: '0.5rem' }}
                    ></i>
                    Liên hệ
                  </Link>
                </li>
              </ul>

              {/* Right Side Actions */}
              <ul
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  gap: '1rem',
                }}
              >
                {/* Cart */}
                <li style={{ position: 'relative' }}>
                  <Link
                    to="/customer/cart"
                    style={{
                      color: '#64748b',
                      textDecoration: 'none',
                      fontSize: '1.25rem',
                      position: 'relative',
                    }}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    {itemCount > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-4px',
                          right: '-4px',
                          background:
                            'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                          color: 'white',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </li>

                {/* User Menu */}
                <li style={{ position: 'relative' }}>
                  {isAuthenticated && user ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                      className="user-dropdown"
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          background:
                            'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '1rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease',
                          marginRight: '8px',
                        }}
                      >
                        {user.username?.charAt(0) || 'U'}
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#1e293b',
                        }}
                        className="d-none d-md-inline"
                      >
                        {user.username}
                      </span>

                      {/* Dropdown Menu */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          background: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          border: '1px solid #e2e8f0',
                          minWidth: '200px',
                          zIndex: 1000,
                          backdropFilter: 'blur(10px)',
                          display: 'none',
                          marginTop: '8px',
                        }}
                        className="dropdown-menu"
                      >
                        <div style={{ padding: '8px 0' }}>
                          <Link
                            to="/customer/profile"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '8px 16px',
                              color: '#374151',
                              textDecoration: 'none',
                              fontSize: '14px',
                              transition: 'background 0.2s ease',
                            }}
                            onMouseOver={e => {
                              e.currentTarget.style.background = '#f9fafb';
                            }}
                            onMouseOut={e => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <i
                              className="fas fa-user"
                              style={{ marginRight: '8px', width: '16px' }}
                            ></i>
                            Thông tin tài khoản
                          </Link>
                          <Link
                            to="/customer/orders"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '8px 16px',
                              color: '#374151',
                              textDecoration: 'none',
                              fontSize: '14px',
                              transition: 'background 0.2s ease',
                            }}
                            onMouseOver={e => {
                              e.currentTarget.style.background = '#f9fafb';
                            }}
                            onMouseOut={e => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <i
                              className="fas fa-shopping-bag"
                              style={{ marginRight: '8px', width: '16px' }}
                            ></i>
                            Lịch sử đơn hàng
                          </Link>
                          <Link
                            to="/customer/service-requests"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '8px 16px',
                              color: '#374151',
                              textDecoration: 'none',
                              fontSize: '14px',
                              transition: 'background 0.2s ease',
                            }}
                            onMouseOver={e => {
                              e.currentTarget.style.background = '#f9fafb';
                            }}
                            onMouseOut={e => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <i
                              className="fas fa-clipboard-list"
                              style={{ marginRight: '8px', width: '16px' }}
                            ></i>
                            Lịch sử yêu cầu dịch vụ
                          </Link>
                          <hr
                            style={{
                              margin: '8px 0',
                              border: 'none',
                              borderTop: '1px solid #e5e7eb',
                            }}
                          />
                          <button
                            onClick={handleLogout}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              padding: '8px 16px',
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              fontSize: '14px',
                              cursor: 'pointer',
                              transition: 'background 0.2s ease',
                              textAlign: 'left',
                            }}
                            onMouseOver={e => {
                              e.currentTarget.style.background = '#fef2f2';
                            }}
                            onMouseOut={e => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <i
                              className="fas fa-sign-out-alt"
                              style={{ marginRight: '8px', width: '16px' }}
                            ></i>
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to="/auth/login"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#64748b',
                        textDecoration: 'none',
                        fontSize: '1.25rem',
                      }}
                    >
                      <i
                        className="fas fa-user-circle"
                        style={{ marginRight: '8px' }}
                      ></i>
                      <span
                        style={{ fontSize: '14px' }}
                        className="d-none d-md-inline"
                      >
                        Đăng nhập
                      </span>
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ marginTop: '76px' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          background: '#1e293b',
          color: 'white',
          padding: '3rem 0 1rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem',
            }}
          >
            {/* About */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <i
                  className="fas fa-car-side"
                  style={{
                    color: '#0ea5e9',
                    marginRight: '0.5rem',
                    fontSize: '1.5rem',
                  }}
                ></i>
                <span
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                  }}
                >
                  MTProAuto
                </span>
              </div>
              <p
                style={{
                  color: '#94a3b8',
                  lineHeight: 1.6,
                  marginBottom: '1rem',
                }}
              >
                Hệ thống quản lý gara ô tô chuyên nghiệp, cung cấp dịch vụ sửa
                chữa và bảo dưỡng xe hơi chất lượng cao.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                }}
              >
                <a
                  href="#"
                  style={{
                    color: '#94a3b8',
                    fontSize: '1.25rem',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.color = '#0ea5e9';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <i className="fab fa-facebook"></i>
                </a>
                <a
                  href="#"
                  style={{
                    color: '#94a3b8',
                    fontSize: '1.25rem',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.color = '#0ea5e9';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="#"
                  style={{
                    color: '#94a3b8',
                    fontSize: '1.25rem',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.color = '#0ea5e9';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                Liên kết nhanh
              </h4>
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                }}
              >
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link
                    to="/customer/home"
                    style={{
                      color: '#94a3b8',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.color = '#0ea5e9';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.color = '#94a3b8';
                    }}
                  >
                    Trang chủ
                  </Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link
                    to="/customer/services"
                    style={{
                      color: '#94a3b8',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.color = '#0ea5e9';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.color = '#94a3b8';
                    }}
                  >
                    Dịch vụ
                  </Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link
                    to="/customer/products"
                    style={{
                      color: '#94a3b8',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.color = '#0ea5e9';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.color = '#94a3b8';
                    }}
                  >
                    Sản phẩm
                  </Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link
                    to="/customer/contact"
                    style={{
                      color: '#94a3b8',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.color = '#0ea5e9';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.color = '#94a3b8';
                    }}
                  >
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                Thông tin liên hệ
              </h4>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  color: '#94a3b8',
                }}
              >
                <i
                  className="fas fa-phone"
                  style={{ marginRight: '0.5rem', width: '16px' }}
                ></i>
                0123 456 789
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  color: '#94a3b8',
                }}
              >
                <i
                  className="fas fa-envelope"
                  style={{ marginRight: '0.5rem', width: '16px' }}
                ></i>
                info@mtproauto.com
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#94a3b8',
                }}
              >
                <i
                  className="fas fa-map-marker-alt"
                  style={{ marginRight: '0.5rem', width: '16px' }}
                ></i>
                123 Đường ABC, TP.HCM
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div
            style={{
              borderTop: '1px solid #334155',
              paddingTop: '1rem',
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: '0.875rem',
            }}
          >
            © 2024 MTProAuto. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </footer>

      <style>
        {`
          @media (max-width: 768px) {
            .mobile-menu-btn {
              display: block !important;
            }
            .desktop-nav {
              display: none !important;
            }
          }
          
          .user-dropdown:hover .dropdown-menu {
            display: block !important;
          }
          
          .d-none {
            display: none;
          }
          
          @media (min-width: 768px) {
            .d-md-inline {
              display: inline !important;
            }
          }
        `}
      </style>
    </div>
  );
};
