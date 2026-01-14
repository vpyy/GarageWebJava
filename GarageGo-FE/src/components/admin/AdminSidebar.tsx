import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { cn } from '../../utils/helpers';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuSections = [
  {
    title: 'Main Menu',
    items: [
      {
        title: 'Dashboard',
        icon: 'fas fa-home',
        path: '/admin/dashboard',
      },
      {
        title: 'Thống kê',
        icon: 'fas fa-chart-line',
        path: '/admin/statistics',
      },
      {
        title: 'Khách hàng',
        icon: 'fas fa-users',
        path: '/admin/customers',
      },
      {
        title: 'Xe',
        icon: 'fas fa-car',
        path: '/admin/vehicles',
      },
    ]
  },
  {
    title: 'Dịch vụ',
    items: [
      {
        title: 'Dịch vụ',
        icon: 'fas fa-tools',
        path: '/admin/services',
      },
      {
        title: 'Yêu cầu',
        icon: 'fas fa-clipboard-list',
        path: '/admin/requests',
      },
      {
        title: 'Hóa đơn',
        icon: 'fas fa-file-invoice-dollar',
        path: '/admin/invoices',
      },
    ]
  },
  {
    title: 'Kho hàng',
    items: [
      {
        title: 'Sản phẩm',
        icon: 'fas fa-box',
        path: '/admin/products',
      },
      {
        title: 'Thống kê',
        icon: 'fas fa-chart-bar',
        path: '/admin/reports',
      },
    ]
  },
  {
    title: 'Cài đặt',
    items: [
      {
        title: 'Liên hệ',
        icon: 'fas fa-envelope',
        path: '/admin/contacts',
      },
      {
        title: 'Cài đặt',
        icon: 'fas fa-cog',
        path: '/admin/settings',
      },
    ]
  }
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen flex flex-col transition-all duration-300',
          isOpen ? 'w-64' : 'w-16'
        )}
        style={{
          background: 'linear-gradient(180deg, #2377FC 0%, #1B5EE6 100%)',
          boxShadow: '4px 0 20px rgba(35, 119, 252, 0.15)'
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg backdrop-blur-sm">
              <i className="fas fa-car-side text-white text-lg"></i>
            </div>
            {isOpen && (
              <div>
                <h1 className="text-xl font-bold text-white">MTProAuto</h1>
                <p className="text-xs text-white/70">Admin Panel</p>
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className="hidden lg:flex items-center justify-center w-8 h-8 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            {isOpen ? <i className="fas fa-chevron-left text-sm"></i> : <i className="fas fa-chevron-right text-sm"></i>}
          </button>
        </div>

        {/* User Info */}
        {isOpen && (
          <div className="p-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-semibold text-lg">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user?.name || user?.username}
                </p>
                <p className="text-white/70 text-sm">Quản trị viên</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto py-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}>
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {isOpen && (
                <div className="px-4 mb-3">
                  <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
              )}
              <div className="space-y-1 px-2">
                {section.items.map((item, itemIndex) => {
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <NavLink
                      key={itemIndex}
                      to={item.path}
                      className={cn(
                        'flex items-center px-3 py-3 mx-2 rounded-xl transition-all duration-200 group relative',
                        isActive
                          ? 'bg-white text-primary-600 shadow-lg'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                        <i className={cn(item.icon, 'text-base')}></i>
                      </div>
                      {isOpen && (
                        <span className="ml-3 font-medium truncate">{item.title}</span>
                      )}
                      {!isOpen && (
                        <div className="absolute left-16 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                          {item.title}
                          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 flex flex-col transform transition-transform duration-300 lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{
          background: 'linear-gradient(180deg, #2377FC 0%, #1B5EE6 100%)',
          boxShadow: '4px 0 20px rgba(35, 119, 252, 0.15)'
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg backdrop-blur-sm">
              <i className="fas fa-car-side text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MTProAuto</h1>
              <p className="text-xs text-white/70">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-8 h-8 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-semibold text-lg">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {user?.name || user?.username}
              </p>
              <p className="text-white/70 text-sm">Quản trị viên</p>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto py-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}>
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <div className="px-4 mb-3">
                <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
              <div className="space-y-1 px-2">
                {section.items.map((item, itemIndex) => {
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <NavLink
                      key={itemIndex}
                      to={item.path}
                      onClick={onToggle}
                      className={cn(
                        'flex items-center px-3 py-3 mx-2 rounded-xl transition-all duration-200',
                        isActive
                          ? 'bg-white text-primary-600 shadow-lg'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                        <i className={cn(item.icon, 'text-base')}></i>
                      </div>
                      <span className="ml-3 font-medium">{item.title}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};