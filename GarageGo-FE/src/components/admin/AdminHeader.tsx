import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { cn } from '../../utils/helpers';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector((state: RootState) => state.ui);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const unreadNotifications = notifications.filter(n => !n.timestamp);

  return (
    <header className="bg-white border-b border-secondary-200 h-16 flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden flex items-center justify-center w-8 h-8 text-secondary-600 hover:text-secondary-900 transition-colors"
        >
          <span className="text-lg">☰</span>
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 w-80 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex items-center justify-center w-8 h-8 text-secondary-600 hover:text-secondary-900 transition-colors"
          >
            <span className="text-lg">🔔</span>
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-secondary-200 rounded-lg shadow-large z-50">
              <div className="p-4 border-b border-secondary-200">
                <h3 className="font-medium text-secondary-900">Thông báo</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map(notification => (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-secondary-100 hover:bg-secondary-50"
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full mt-2',
                            notification.type === 'success' && 'bg-success-500',
                            notification.type === 'error' && 'bg-danger-500',
                            notification.type === 'warning' && 'bg-warning-500',
                            notification.type === 'info' && 'bg-primary-500'
                          )}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-secondary-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-secondary-600 mt-1">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-secondary-500">
                    Không có thông báo mới
                  </div>
                )}
              </div>
              {notifications.length > 5 && (
                <div className="p-4 border-t border-secondary-200">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Xem tất cả thông báo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-medium text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-secondary-900">
                {user?.username}
              </p>
              <p className="text-xs text-secondary-500">Quản trị viên</p>
            </div>
            <span className="text-secondary-400">▼</span>
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-secondary-200 rounded-lg shadow-large z-50">
              <div className="p-2">
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
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};
