import React from 'react';
import { Outlet } from 'react-router-dom';
import { Car } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            GarageGo
          </h1>
          <p className="text-secondary-600">Hệ thống quản lý gara ô tô</p>
        </div>

        {/* Auth Form Container */}
        <div className="bg-white rounded-2xl shadow-large p-8">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-secondary-500 text-sm">
            © 2024 GarageGo. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </div>
  );
};
