import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { openCart } from '../../store/slices/cartSlice';
import { cn } from '../../utils/helpers';

const navigationItems = [
  { name: 'Trang chủ', href: '/', icon: '🏠' },
  { name: 'Dịch vụ', href: '/services', icon: '⚙️' },
  { name: 'Sản phẩm', href: '/products', icon: '📦' },
  { name: 'Liên hệ', href: '/contact', icon: '📞' },
];

export const PublicHeader: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { itemCount } = useSelector((state: RootState) => state.cart);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/');
  };

  const handleCartClick = () => {
    dispatch(openCart());
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-secondary-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
              <span className="text-white text-lg">🚗</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-secondary-900">GarageGo</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map(item => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors',
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-secondary-700 hover:text-primary-600 hover:bg-secondary-50'
                  )
                }
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              className="relative flex items-center justify-center w-10 h-10 text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 rounded-lg transition-colors"
            >
              <span className="text-lg">🛒</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-secondary-900">
                    {user?.username}
                  </span>
                  <span className="text-secondary-400 text-sm">▼</span>
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-secondary-200 rounded-lg shadow-large z-50">
                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-3 w-full px-3 py-2 text-left rounded-lg hover:bg-secondary-50 transition-colors"
                      >
                        <span className="text-secondary-400">👤</span>
                        <span className="text-sm text-secondary-700">
                          Hồ sơ
                        </span>
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-3 w-full px-3 py-2 text-left rounded-lg hover:bg-secondary-50 transition-colors"
                      >
                        <span className="text-secondary-400">📦</span>
                        <span className="text-sm text-secondary-700">
                          Đơn hàng
                        </span>
                      </Link>
                      <Link
                        to="/service-requests"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-3 w-full px-3 py-2 text-left rounded-lg hover:bg-secondary-50 transition-colors"
                      >
                        <span className="text-secondary-400">⚙️</span>
                        <span className="text-sm text-secondary-700">
                          Yêu cầu dịch vụ
                        </span>
                      </Link>
                      <hr className="my-2 border-secondary-200" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-3 py-2 text-left rounded-lg hover:bg-danger-50 transition-colors text-danger-600"
                      >
                        <span>🚪</span>
                        <span className="text-sm">Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 text-secondary-600 hover:text-secondary-900 transition-colors"
            >
              {mobileMenuOpen ? (
                <span className="text-lg">✕</span>
              ) : (
                <span className="text-lg">☰</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-secondary-200 py-4">
            <nav className="space-y-2">
              {navigationItems.map(item => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors',
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-secondary-700 hover:text-primary-600 hover:bg-secondary-50'
                    )
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* Mobile Auth Buttons */}
            {!isAuthenticated && (
              <div className="mt-4 pt-4 border-t border-secondary-200 space-y-2">
                <Link
                  to="/auth/login"
                  className="block w-full px-3 py-2 text-center text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/auth/register"
                  className="block w-full px-3 py-2 text-center text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns - GIỐNG ADMIN HEADER */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  );
};
